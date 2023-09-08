// '/board'로 오는 모든 요청은 여기서 처리
const express = require('express');
const controller = require('../controller/Cboard');
const router = express.Router();

router.get('/', controller.board); // 게시글 목록 화면

module.exports = router;
