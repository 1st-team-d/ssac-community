const express = require('express');
const router = express.Router();
const controller = require('../controller/Cstudy');

function checkSession(req, res, next) {
  if (!req.session.userInfo) {
    return res.render('/');
  } else {
    next();
  }
}

router.get('/', checkSession, controller.getStudy); // 스터디 (관리) 화면으로 이동
router.get('/profile/:studySeq', checkSession, controller.getStudyProfile); // 스터디 세부 정보
router.patch('/apply', checkSession, controller.patchStudyApply); // 스터디 신청 처리
router.patch('/close', checkSession, controller.patchStudyClose); // 스터디 마감 처리

module.exports = router;
