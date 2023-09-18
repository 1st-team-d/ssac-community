const express = require('express');
const router = express.Router();
const controller = require('../controller/Ccomment');

router.get('/', controller.getComment); // 모든 댓글 조회

module.exports = router;