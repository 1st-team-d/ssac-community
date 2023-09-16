const express = require('express');
const router = express.Router();
const controller = require('../controller/Cstudy');

router.get('/', controller.getStudy); // 스터디 (관리) 화면으로 이동


router.patch('/apply', controller.patchStudyApply); // 스터디 신청 처리
router.patch('/close', controller.patchStudyClose); // 스터디 마감 처리

module.exports = router;