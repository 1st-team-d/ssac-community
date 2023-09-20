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

    if (newComment) {
      // res.redirect(`${process.env.DB_HOST}/board/${postID}`)
      res.send({ result: true });
    } else {
      res.send({ result: false });
    }
  } catch (err) {
    console.log('err----------------', err);
    res.send('Internal Server Error!!!');
  }
};

exports.patchComment = async (req, res) => {
  try {
    const { commentSeq, cmtContent } = req.body;
    const patchedComment = await Comment.update(
      {
        content: cmtContent,
      },
      {
        where: {
          commentSeq: commentSeq,
        },
      }
    );
    if (patchedComment) {
      res.send({ result: true });
    } else {
      res.send({ result: false });
    }
  } catch (err) {
    console.log('err----------------', err);
    res.send('Internal Server Error!!!');
  }
};

exports.removeComment = async (req, res) => {
  try {
    const { commentSeq } = req.body;
    const deletedComment = await Comment.destroy({
      where: { commentSeq: commentSeq },
    });
    if (deletedComment) {
      res.send({ result: true });
    } else {
      res.send({ result: false });
    }
  } catch (err) {
    console.log('err----------------', err);
    res.send('Internal Server Error!!!');
  }
};
