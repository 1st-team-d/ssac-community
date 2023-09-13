const { Board } = require("../models");

// 게시글 조회 화면
exports.getBoard = async (req, res) => {
  // Todo: 게시글 조회 화면 파일명 확인

  res.render("board/listBoard");
  // res.render("board/postBoard");
};

// 특정 게시글 화면
exports.getBoardId = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스
    const { boardSeq } = req.params;
    console.log(boardSeq);

    // DB 접근
    const board = await Board.findOne({
      where: { boardSeq: boardSeq },
    });

    // res.render("임시값", {
    //   isGetBoardId: true,
    //   title: board.title,
    //   content: board.content,
    //   imgPath: board.imgPath,
    //   count: board.count,
    //   msg: "특정 게시물 화면 띄우기 성공",
    // });
    res.send(board);
  } catch (err) {
    console.error(err);
    res.send({ isGetBoardId: false, msg: "특정 게시물 화면 띄우기 실패" });
  }
};

// 게시글 검색 -> 조회 - 진행 중
exports.getSearch = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.send({ isSearch: false });
  }
};

// 게시글 삭제 처리
exports.deleteBoard = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스
    const { seq } = req.body;

    // DB 접근
    const board = await Board.destroy({
      where: { boardSeq: seq },
    });

    if (board) {
      res.send({ isDelete: true, msg: "게시물 삭제 성공" });
    } else {
      res.send({ isDelete: false, msg: "게시글 시퀀스 오류" });
    }
  } catch (err) {
    console.error(err);
    res.send({ isDelete: false, msg: "게시물 삭제 실패" });
  }
};
