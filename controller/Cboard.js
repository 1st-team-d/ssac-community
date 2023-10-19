const {
  Board,
  User,
  Study,
  StudyApply,
  sequelize,
  Comment,
} = require('../models');
const Op = require('sequelize').Op;
const path = require('path');

// 게시글 화면
exports.getBoard = async (req, res) => {
  try {
    // 페이징 처리
    const pageNum = 1;
    const boardCountPerPage = 10; // 한 화면에 보여질 게시글 개수
    const offset = boardCountPerPage * (pageNum - 1); // 페이징 처리

    // 전체 게시글 개수 필요
    const selectAllBoard = await Board.findAll();
    const allBoardLen = selectAllBoard.length;

    // 게시글 관련 세션 생성
    req.session.boardInfo = {
      search: undefined,
      pageNum: pageNum,
      category: ['0', '1', '2', '3', '4', '5'], // 모든 카테고리 입력
    };

    const board = await Board.findAll({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'createdAt',
        'updatedAt',
        'user.userSeq',
        'user.id',
        'user.pw',
        'user.name',
        'user.isAdmin',
      ],
      order: [[sequelize.col('board.createdAt'), 'DESC']],
      offset: offset,
      limit: boardCountPerPage,
      include: [{ model: User }, { model: Study }],
    });

    const cookie = req.signedCookies.remain;

    res.render('board/listBoard', {
      data: board,
      allBoardLen: allBoardLen,
      session: req.session.userInfo,
      cookieEmail: cookie ? cookie.loginEmail : '',
      cookiePw: cookie ? cookie.loginPw : '',
    });
  } catch (err) {}
};

// GET '/board/list'
// GET '/board/list?boardSeq=###'
// GET '/board/list?search=###'
// GET '/board/list?category=###'
// GET '/board/list?pageNum=###'
// 특정 게시글 조회 / 게시글 검색 / 카테고리 검색 / 페이징 처리
exports.getBoardList = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스, 검색어
    const { boardSeq, search, pageNum, category } = req.query;
    console.log('###########################');
    console.log(category);
    console.log('###########################');

    // 1) 기존 검색어나 카테고리 정보가 다를 경우, 페이지 번호를 1로 설정
    // 배열 비교 및 값을 가지고 있는지 확인하는 방법
    // - 참고 : https://velog.io/@bepyan/JS-%EB%B0%B0%EC%97%B4%EB%A5%BC-%EB%B9%84%EA%B5%90%ED%95%98%EB%8A%94-%EB%B2%95)
    function arraysEqual(arr1, arr2) {
      if (!arr1 || !arr2) return false; // 빈 배열이 아닌 undefined, null, '' 이면 false
      if (arr1.length !== arr2.length) return false; // 길이가 같은지 먼저 비교
      for (let i = 0; i < arr1.length; ++i) {
        // 요소 값을 하나하나 비교
        if (arr1[i] !== arr2[i]) return false;
      }

      return true;
    }

    if (
      search !== req.session.boardInfo.search ||
      !arraysEqual(category, req.session.boardInfo.category)
    ) {
      req.session.boardInfo.pageNum = '1';
    } else {
      req.session.boardInfo.pageNum = pageNum;
    }

    // 2) 검색, 페이지 정보를 세션에 저장
    if (search) req.session.boardInfo.search = search;
    if (category) {
      req.session.boardInfo.category = category;
    } else { // 카테고리 값이 없는 경우, 모든 카테고리 값을 저장
      req.session.boardInfo.category = ['0', '1', '2', '3', '4', '5'];
    }

    // 페이징 처리
    let boardCountPerPage = 10; // 한 화면에 보여질 게시글 개수
    let offset = 0; // 페이징 처리
    if (req.session.boardInfo.pageNum > 1) {
      offset = boardCountPerPage * (req.session.boardInfo.pageNum - 1);
    }

    // 전체 게시글 개수 필요
    const selectAllBoard = await Board.findAll();
    const allBoardLen = selectAllBoard.length;

    // 쿠키
    const cookie = req.signedCookies.remain;

    // ###########################################
    // 1. 특정 게시글 조회 및 해당 게시글의 댓글 조회
    // ###########################################
    if (boardSeq) {
      const board = await Board.findOne({
        attributes: [
          'boardSeq',
          'title',
          'content',
          'filePath',
          'count',
          [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
          [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
          [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
          'createdAt',
          'updatedAt',
          'user.userSeq',
          'user.id',
          'user.pw',
          'user.name',
          'user.isAdmin',
          'study.studySeq',
        ],
        where: { boardSeq: boardSeq },
        include: [{ model: User }, { model: Study }],
      });

      // DB의 조회수(count) 1 증가
      await Board.update(
        { count: board.count + 1 },
        { where: { boardSeq: boardSeq } }
      );

      // 해당 게시글의 댓글 조회
      const allComment = await Comment.findAll({
        attributes: ['commentSeq', 'content', 'user.name'],
        where: {
          boardSeq: boardSeq,
        },
        include: [{ model: User }],
      });

      res.render('board/viewBoard', {
        board: board,
        allBoardLen: allBoardLen,
        user: board.user,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
        comments: allComment,
      });

      // ###########################################
      // 2. 게시글 검색 / 카테고리 / 페이징 처리
      // ###########################################
    } else {
      // 세션에 검색어가 없는 경우, '%%'로 전체 검색 설정
      const paramSearch = req.session.boardInfo.search
        ? req.session.boardInfo.search
        : '';
      // 세션에 카테고리 값이 없는 경우, 전체 검색
      const paramCategory = req.session.boardInfo.category;

      const board = await Board.findAll({
        attributes: [
          'boardSeq',
          'title',
          'content',
          'filePath',
          'count',
          [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
          [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
          [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
          'createdAt',
          'updatedAt',
          'user.userSeq',
          'user.id',
          'user.pw',
          'user.name',
          'user.isAdmin',
        ],
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: `%${paramSearch}%` },
            },
            {
              content: { [Op.like]: `%${paramSearch}%` },
            },
          ],
        },
        order: [[sequelize.col('board.createdAt'), 'DESC']],
        offset: offset,
        limit: boardCountPerPage,
        include: [
          { model: User },
          {
            model: Study,
            where: {
              category: {
                [Op.in]: paramCategory,
              },
            },
          },
        ],
      });

      res.send({
        data: board,
        allBoardLen: allBoardLen,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
      });
    }
  } catch (err) {
    console.error(err);
    res.send({ isGetBoardId: false, msg: '게시물 화면 띄우기 실패' });
  }
};

// 게시글 삭제 처리
exports.deleteBoard = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스
    const { boardSeq } = req.body;

    // DB 접근
    const board = await Board.destroy({
      where: { boardSeq: boardSeq },
    });

    if (board) {
      res.send({ isDelete: true, msg: '게시물 삭제 성공' });
    } else {
      res.send({ isDelete: false, msg: '게시글 시퀀스 오류' });
    }
  } catch (err) {
    console.error(err);
    res.send({ isDelete: false, msg: '게시물 삭제 실패' });
  }
};

// GET '/board/register'
// 게시글 등록 화면으로 이동 (수정 화면도 동일)
exports.getRegister = (req, res) => {
  const cookie = req.signedCookies.remain;

  if (req.session.userInfo) {
    res.render('board/postBoard', {
      boardInfo: '',
      studyInfo: '',
      session: req.session.userInfo,
      cookieEmail: cookie ? cookie.loginEmail : '',
      cookiePw: cookie ? cookie.loginPw : '',
    });
  } else {
    // 세션있을 때만 등록 화면 나오게
    res.redirect('/');
  }
};

// POST '/board/register'
// 게시글 등록
exports.postRegister = async (req, res) => {
  try {
    let filePath = null;
    // 파일 정보가 있는지 확인
    if (req.file) {
      const { destination, filename } = req.file;
      filePath = destination.split(path.sep)[1] + path.sep + filename; // 파일명
    }

    const { title, content, category, maxPeople } = req.body;
    // json 형태로 넘어와서 객체 형태로 전환
    const maxPeopleObject = JSON.parse(maxPeople);

    // ############### DB 작업 ###############
    const insertOneBoard = await Board.create({
      title: title,
      content: content,
      filePath: filePath,
      userSeq: req.session.userInfo.userSeq,
    });

    // 게시글 등록이 완료되면 작업
    // 스터디 정보에 해당 정보 등록
    // 스터디 신청현황에 모집장(리더)의 정보를 입력
    if (insertOneBoard) {
      // 스터디 정보
      const insertOneStudy = await Study.create({
        category: category,
        maxPeople: maxPeopleObject[0].value,
        boardSeq: insertOneBoard.boardSeq,
      });

      // 스터디 신청현황
      const insertOneStudyApply = await StudyApply.create({
        studySeq: insertOneStudy.studySeq,
        userSeq: req.session.userInfo.userSeq,
      });

      const cookie = req.signedCookies.remain;

      if (insertOneBoard) {
        res.redirect(`/board?boardSeq=${insertOneBoard.boardSeq}`);
      } else {
        res.render('board/listBoard', {
          cookieEmail: cookie ? cookie.loginEmail : '',
          cookiePw: cookie ? cookie.loginPw : '',
        });
      }
    }
  } catch (err) {}
};

// GET '/board/modify'
// 게시글 수정 화면
exports.getModify = async (req, res) => {
  try {
    const { boardSeq } = req.query;
    const selectOneBoard = await Board.findOne({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'createdAt',
        'updatedAt',
        'userSeq',
        'study.studySeq',
        'study.category',
        'study.maxPeople',
        'study.status',
      ],
      include: [{ model: Study }],
      where: {
        boardSeq: boardSeq,
      },
    });

    const cookie = req.signedCookies.remain;

    if (req.session.userInfo) {
      res.render('board/postBoard', {
        boardInfo: selectOneBoard,
        studyInfo: selectOneBoard.dataValues.study,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
      });
    } else {
      // 세션있을 때만 등록 화면 나오게
      res.redirect('/');
    }
  } catch (err) {}
};

// PATCH '/board/modify'
// 게시글 수정 처리
exports.patchModify = async (req, res) => {
  try {
    // 파일 있는지 확인
    let filePath = null;

    if (req.file) {
      // 이미지 업로드
      const { destination, filename } = req.file;
      filePath = destination.split(path.sep)[1] + path.sep + filename; // 파일명
    }

    const { title, content, boardSeq, studySeq, category, maxPeople } =
      req.body;
    // json 형태로 넘어와서 객체 형태로 전환
    const maxPeopleObject = JSON.parse(maxPeople);

    // ###### 수정 시, 파일 미업로드 시 null로 저장되는 버그 수정 ######
    // 파일 경로가 없는 경우,
    // DB에 이미 있는 파일 경로를 찾아와서 있으면 설정
    // 없으면 null로 저장 → 원래 없었기 때문
    if (!filePath) {
      const selectFilePath = await Board.findOne({
        where: {
          boardSeq: boardSeq,
        },
      });

      // 파일이 있으면 기존 DB에 있는 파일로 설정
      if (selectFilePath) {
        filePath = selectFilePath.filePath;
      }
    }

    // DB 작업
    const updateOneBoard = await Board.update(
      {
        title: title,
        content: content,
        filePath: filePath,
      },
      {
        where: {
          boardSeq: boardSeq,
        },
      }
    );

    // 수정에 성공하면 스터디 정보 수정
    // 스터디 신청현황은 수정할 필요 없음
    if (updateOneBoard) {
      const updateOneStudy = await Study.update(
        {
          category: parseInt(category), // 문자형 → 정수형
          maxPeople: parseInt(maxPeopleObject[0].value), // 문자형 → 정수형
        },
        {
          where: {
            studySeq: studySeq,
          },
        }
      );

      const cookie = req.signedCookies.remain;

      if (updateOneBoard && updateOneStudy) {
        res.send({
          cookieEmail: cookie ? cookie.loginEmail : '',
          cookiePw: cookie ? cookie.loginPw : '',
          msg: 'success',
        });
      } else {
        res.send({
          cookieEmail: cookie ? cookie.loginEmail : '',
          cookiePw: cookie ? cookie.loginPw : '',
          msg: 'update study fail',
        });
      }
    } else {
      res.send({
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
        msg: 'update board fail',
      });
    }
  } catch (err) {}
};
