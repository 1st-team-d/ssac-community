const { Board, User, Study, StudyApply, sequelize } = require('../models');
const Op = require('sequelize').Op;
const path = require('path');

// 게시글 화면
exports.getBoard = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스, 검색어
    const { boardSeq, search, pageNum } = req.query;
    // 페이징 처리
    let boardCountPerPage = 5; // 한 화면에 보여질 게시글 개수
    let offset = 0; // 페이징 처리
    if (pageNum > 1) {
      offset = boardCountPerPage * (pageNum - 1);
    }

    // console.log('query >> ', req.query);
    // 전체 게시글 개수 필요
    const selectAllBoard = await Board.findAll();
    const allBoardLen = selectAllBoard.length;

    // 특정 게시글 조회
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

      console.log('session>>>>>>', req.session.userInfo);
      // console.log('특정 게시글 board>>>>>>>', board);

      const cookie = req.signedCookies.remain;

      res.render('board/viewBoard', {
        board: board,
        allBoardLen: allBoardLen,
        user: board.user,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
      });

      // 게시글 검색
    } else if (search) {
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
        ],
        where: {
          [Op.or]: [
            {
              title: { [Op.like]: `%${search}%` },
            },
            {
              content: { [Op.like]: `%${search}%` },
            },
          ],
        },
        order: [[sequelize.col('board.createdAt'), 'DESC']],
        offset: offset,
        limit: boardCountPerPage,
      });

      console.log('session>>>>>>', req.session.userInfo);

      const cookie = req.signedCookies.remain;

      res.send({
        data: board,
        allBoardLen: allBoardLen,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
      });

      // 페이지 번호 '2'이상 넘어오는 경우
    } else if (pageNum > 1) {
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
        include: [{ model: User }],
      });

      const cookie = req.signedCookies.remain;

      // console.log(board.length);
      console.log('보드는>>>>>>>', board);
      console.log('session>>>>>>', req.session.userInfo);
      res.send({
        data: board,
        // allBoardLen: allBoardLen,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
      });

      // 전체 게시글 조회 + 페이지 번호 '1' 인 경우
    } else {
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
        include: [{ model: User }],
      });

      // console.log(board.length);
      console.log('session>>>>>>', req.session.userInfo);
      console.log('전체 게시글 보드 정보', board[0]);

      const cookie = req.signedCookies.remain;

      res.render('board/listBoard', {
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
// 게시글 등록 화면으로 이동 // 수정 화면도 동일
exports.getRegister = (req, res) => {
  const cookie = req.signedCookies.remain;

  if (req.session.userInfo) {
    res.render('board/postBoard', {
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
    // ############### 파일 업로드 문제 없는지 확인 ###############

    console.log('######### req.file ::::: ', req.file); // single
    console.log('######### req.body ::::: ', req.body); // single
    let filePath = null;
    // 파일 정보가 있는지 확인
    if (req.file) {
      const { destination, filename } = req.file;
      filePath = destination.split(path.sep)[1] + path.sep + filename; // 파일명
    }

    // rest client 실행시
    const jsonData = JSON.parse(req.body['data']); // 넘어온 JSON 데이터를 JS Object로 변환
    const { title, content, category, maxPeople } = jsonData;

    // 실제 코드
    // const { title, content, category, maxPeople } = req.body;

    // ############### DB 작업 ###############
    const insertOneBoard = await Board.create({
      title: title,
      content: content,
      filePath: filePath,
      userSeq: req.session.userInfo.userSeq,
    });

    // console.log(insertOneBoard);

    // 게시글 등록이 완료되면 작업
    // 스터디 정보에 해당 정보 등록
    // 스터디 신청현황에 모집장(리더)의 정보를 입력
    if (insertOneBoard) {
      // 스터디 정보
      const insertOneStudy = await Study.create({
        category: category,
        maxPeople: maxPeople,
        boardSeq: insertOneBoard.boardSeq,
      });

      // 스터디 신청현황
      const insertOneStudyApply = await StudyApply.create({
        studySeq: insertOneStudy.studySeq,
        userSeq: req.session.userInfo.userSeq,
      });
    }

    // res.redirect('/board');
    // console.log(insertOneBoard);

    const cookie = req.signedCookies.remain;

    res.send(insertOneBoard, {
      cookieEmail: cookie ? cookie.loginEmail : '',
      cookiePw: cookie ? cookie.loginPw : '',
    });
  } catch (err) {
    console.log(err);
  }
};

// GET '/board/modify'
// 게시글 수정 화면
exports.getModify = async (req, res) => {
  try {
    const { boardSeq } = req.query;
    const selectOneBoard = await Board.findOne({
      where: {
        boardSeq: boardSeq,
      },
    });
    console.log('@@@@@@@@@', selectOneBoard);

    const cookie = req.signedCookies.remain;

    if (req.session.userInfo) {
      res.render('board/postBoard', {
        result: selectOneBoard,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
      });
    } else {
      // 세션있을 때만 등록 화면 나오게
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
};

// PATCH '/board/modify'
// 게시글 수정 처리
exports.patchModify = async (req, res) => {
  try {
    // 파일 있는지 확인
    let filePath = null;
    console.log('수정 응답 >>>>>>', req.body);
    console.log('파일은 >>>>>>>> ', req.file);
    if (req.file) {
      // 이미지 업로드
      const { destination, filename } = req.file;
      filePath = destination.split(path.sep)[1] + path.sep + filename; // 파일명
    }

    // rest client 실행시
    const jsonData = JSON.parse(req.body['data']); // 넘어온 JSON 데이터를 JS Object로 변환
    const { title, content, boardSeq, studySeq, category, maxPeople } =
      jsonData;

    // 실제 코드
    // const { title, content, boardSeq, studySeq, category, maxPeople } = req.body;

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

    // 수정에 성공하면
    // 스터디 정보 수정 → 현재 category, maxPeople 수정을 허용하지 않으므로 주석처리
    // 스터디 신청현황은 수정할 필요 없음
    // if (updateOneBoard) {
    //   const updateOneStudy = await Study.update(
    //     {
    //       // category: category,
    //       // maxPeople: maxPeople,
    //     },
    //     {
    //       where: {
    //         studySeq: studySeq,
    //       },
    //     }
    //   );
    // }

    const cookie = req.signedCookies.remain;

    res.send(updateOneBoard, {
      cookieEmail: cookie ? cookie.loginEmail : '',
      cookiePw: cookie ? cookie.loginPw : '',
    });
  } catch (err) {
    console.log(err);
  }
};
