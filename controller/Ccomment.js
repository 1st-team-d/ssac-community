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
      res.send({ msg: 'newComment success' });
    } else {
      res.send({ msg: 'newComment fail' });
    }
    // res.redirect(`/board?boardSeq=${postID}`);
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
      res.send({ msg: 'patchedComment success' });
    } else {
      res.send({ msg: 'patchedComment fail' });
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
      res.send({ msg: 'deletedComment success' });
    } else {
      res.send({ msg: 'deletedComment fail' });
    }
  } catch (err) {
    console.log('err----------------', err);
    res.send('Internal Server Error!!!');
  }
};
