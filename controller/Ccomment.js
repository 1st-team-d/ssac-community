const { Board } = require('../models/Board');
const { Comment } = require('../models');

// GET '/comment'
// 모든 댓글 조회
exports.getComment = (req, res) => {
  res.send('hello');
};

// 댓글 등록
// 글쓴이, 내용, 게시글seq를 받아서 db에 저장
exports.postComment = async (req, res) => {
  try {
    console.log('Ccomment @@@@@@@@@@@@@@@ ', req.body);
    // cmtContent: 댓글 내용
    const { postID, cmtContent } = req.body;
    console.log('123213123213213');
    const newComment = await Comment.create({
      content: cmtContent,
      boardSeq: postID,
      userSeq: req.session.userInfo.userSeq,
    });
    console.log('..................................');
    res.send('success');
    // res.redirect(`/board?boardSeq=${postID}`);
  } catch (err) {
    console.log('err----------------', err);
    res.send('Internal Server Error!!!');
  }
};
