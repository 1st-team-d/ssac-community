const express = require('express');
const router = express.Router();
const controller = require('../controller/Cadmin');

router.get('/', controller.getAdmin); // 관리자 메인 화면

router.get('/user', controller.getUser);

module.exports = router;
