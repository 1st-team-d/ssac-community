const { Board, Comment } = require('../models');

// GET '/board/'
// 게시글 목록 조회
exports.board = (req, res) => {
  res.render('/'); //임시로 index 렌더 -> 나중에 바꿔야함
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
    // console.log('req.file ::::: ', req.file); // single
    const { fieldname, destination, filename } = req.file;
    const imagePath = destination + filename;
    // console.log('req.files ::::: ', req.files); // fields, array
    // console.log('req.body ::::: ', req.body);

    const jsonData = JSON.parse(req.body['data']); // 넘어온 JSON 데이터를 JS Object로 변환

    // console.log('jsonData ::::: ', jsonData);
    // req.file.preFilepath = '/uploadImage/'; // userUpload 설정
    const { title, content } = jsonData;

    // console.log('title ::::: ', title);
    // console.log('content ::::: ', content);
    // console.log('imagePath ::::: ', imagePath);

    // ############### DB 작업 ###############
    const insertOneBoard = await Board.create({
      title: title,
      content: content,
      imagePath: imagePath,
    });

    // console.log(insertOneBoard);

    // res.send({ file: req.file, data: req.body });
    res.send(insertOneBoard);
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
    const imagePath = destination + filename;

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
