const { Board } = require("../models");

// 게시글 조회 화면 - 진행 중
exports.getBoard = async (req, res) => {
  // res.render("board/postBoard"); // 임시로 postBoard로 등록 -> 페이지 완성시 페이지 교체 필요
};

// 특정 게시글 화면 - 진행 중
exports.getBoardId = async (req, res) => {
  // 특정 게시글의 게시글 시퀀스
  const { boardSeq } = req.params;

  // DB 접근
  const seq = Board.findOne({
    where: { boardSeq: boardSeq },
  });

  // res.render("")
};
