// '/'로 오는 모든 요청은 여기서 처리
const express = require('express');
const controller = require('../controller/Cindex')
const router = express.Router();

router.get('/', controller.index); // 메인 화면

module.exports = router;