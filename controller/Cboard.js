const { Board, Comment, User, sequelize } = require('../models');
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

    console.log('query >> ', req.query);

    if (boardSeq) {
      // 특정 게시글 조회

      // DB 접근
      const board = await Board.findOne({
        where: { boardSeq: boardSeq },
        include: [{ model: User }],
      });

      // DB의 조회수(count) 1 증가
      await Board.update(
        { count: board.count + 1 },
        { where: { boardSeq: boardSeq } }
      );

      res.send(board);
      // res.render("board/viewBoard", { data: board });
    } else if (search) {
      // 게시글 조회
      const board = await Board.findAll({
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
        offset: offset,
        limit: boardCountPerPage,
      });

      res.send(board);
    } else {
      // 전체 게시글 조회

      // DB 접근
      const board = await Board.findAll({
        offset: offset,
        limit: boardCountPerPage,
      });

      // console.log(board);
      res.render('board/listBoard', { data: board });
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
  res.render('board/postBoard');
};

// POST '/board/register'
// 게시글 등록
exports.postRegister = async (req, res) => {
  try {
    // ############### 파일 업로드 문제 없는지 확인 ###############
    console.log('req.file ::::: ', req.file); // single
    const { fieldname, destination, filename } = req.file;
    // console.log(destination.split(path.sep));
    // console.log(filename);

    const imagePath = destination.split(path.sep)[1] + path.sep + filename;
    // console.log('req.files ::::: ', req.files); // fields, array
    // console.log('req.body ::::: ', req.body);

    // const jsonData = JSON.parse(req.body['data']); // 넘어온 JSON 데이터를 JS Object로 변환

    // console.log('jsonData ::::: ', jsonData);
    // req.file.preFilepath = '/uploadFile/'; // userUpload 설정
    const { title, content, userSeq } = req.body;

    // console.log('title ::::: ', title);
    // console.log('content ::::: ', content);
    // console.log('imagePath ::::: ', imagePath);

    // ############### DB 작업 ###############
    await Board.create({
      title: title,
      content: content,
      imagePath: imagePath,
      userSeq: userSeq,
    });

    // console.log(insertOneBoard);

    // res.send({ file: req.file, data: req.body });
    res.send({ result: true });
    // res.send('hello')
  } catch (err) {
    console.log(err);
  }
};

// GET '/board/modify'
// 게시글 수정 화면
exports.getModify = async (req, res) => {
  try {
    const { boardSeq } = req.body;
    const selectOneBoard = await Board.findOne({
      where: {
        boardSeq: boardSeq,
      },
    });

    res.render('board/postBoard', { result: selectOneBoard });
  } catch (err) {
    console.log(err);
  }
};

// PATCH '/board/modify'
// 게시글 수정 처리
exports.patchModify = async (req, res) => {
  try {
    // 이미지 업로드
    const { fieldname, destination, filename } = req.file;
    const imagePath = destination.split(path.sep)[1] + path.sep + filename;

    const jsonData = JSON.parse(req.body['data']);
    const { title, content, boardSeq } = jsonData;

    // DB 작업
    const updateOneBoard = await Board.update(
      {
        title: title,
        content: content,
        imagePath: imagePath,
      },
      {
        where: {
          boardSeq: boardSeq,
        },
      }
    );

    res.send(updateOneBoard);
  } catch (err) {
    console.log(err);
  }
};
