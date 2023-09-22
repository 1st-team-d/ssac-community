const { Board } = require('../models/Board');
const { Comment, User } = require('../models');

// GET '/comment'
// 모든 댓글 조회
exports.getComment = (req, res) => {
  res.send('hello');
};

// 댓글 수정 취소 -> cmtSeq에 해당하는 하나의 댓글 조회해서 원상복구
exports.getOneComment = async (req, res) => {
  try {
    const { commentSeq } = req.query;
    const oneComment = await Comment.findOne({
      where: { commentSeq },
      include: [{ model: User }],
    });
    if (oneComment) {
      res.send({ oneComment: oneComment, result: true });
    } else {
      res.send({ oneComment: '', result: false });
    }
  } catch (err) {
    res.send('Internal Server Error!!!');
  }
};

// 댓글 등록
// 글쓴이, 내용, 게시글seq를 받아서 db에 저장
exports.postComment = async (req, res) => {
  try {
    // cmtContent: 댓글 내용
    const { postID, cmtContent } = req.body;
    const newComment = await Comment.create({
      content: cmtContent,
      boardSeq: postID,
      userSeq: req.session.userInfo.userSeq,
    });

    if (newComment) {
      res.send({ result: true });
    } else {
      res.send({ result: false });
    }
  } catch (err) {
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
    res.send('Internal Server Error!!!');
  }
};
