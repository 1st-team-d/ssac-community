const express = require('express');
const router = express.Router();
const controller = require('../controller/Cadmin');

router.get('/', controller.getAdmin); // 관리자 메인 화면

router.get('/user', controller.getUser); // 모든 유저 조회


router.get('/study', controller.getStudy); // 스터디 조회 화면
router.get('/study/list', controller.getStudyList); // 모든 스터디 조회 + 스터디 검색
router.get('/study/profile/:studySeq', controller.getProfileStudy); // 특정 스터디 조회

module.exports = router;
