// '/board'로 오는 모든 요청은 여기서 처리
const express = require("express");
const controller = require("../controller/Cboard");
const router = express.Router();

// 게시글 조회 화면으로 이동
router.get("/", controller.getBoard);

// 특정 게시글 화면으로 이동 및 조회
router.get("/:boardSeq", controller.getBoardId);

// 게시글 검색 -> 조회
// router.get("?title=###", controller.getSearch);

// 게시글 삭제 처리
router.delete("/remove", controller.deleteBoard);

module.exports = router;
