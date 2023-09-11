const { Board, Comment } = require('../models');

// GET '/board/'
// 게시글 목록 조회
exports.board = (req, res) => {
  res.render('/'); //임시로 index 렌더 -> 나중에 바꿔야함
};

// GET '/board/register'
// 게시글 등록 화면으로 이동 // 수정 화면도 동일
exports.getRegister = (req, res) => {
  res.send('success');
};

// POST '/board/register'
// 게시글 등록
exports.postRegister = (req, res) => {
  try {
    console.log('req.file ::::: ', req.file);
    // req.file.preFilepath = '/uploadImage/'; // userUpload 설정
    const { title, content, imagePath } = req.body;

    console.log('title ::::: ', title);
    console.log('content ::::: ', content);
    console.log('imagePath ::::: ', imagePath);
    console.log('req.file ::::: ', req.file);
    res.send({ file: req.file, data: req.body });
  } catch (err) {
    console.log(err);
  }
};
