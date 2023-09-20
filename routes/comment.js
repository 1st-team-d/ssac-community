const express = require('express');
const router = express.Router();
const controller = require('../controller/Ccomment');

router.get('/', controller.getComment); // 모든 댓글 조회
router.post('/register', controller.postComment); // 댓글 등록하기

module.exports = router;
