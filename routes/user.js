const express = require('express');
const router = express.Router();
const controller = require('../controller/Cuser');

// 회원 가입 처리
router.post('/signup', controller.postSignup);

// 닉네임 중복 확인
router.post('/checkName', controller.postCheckName);

// 이메일 중복 확인
router.post('/checkEmail', controller.postCheckEmail);

// 로그인 처리
router.post('/signin', controller.postSignin);

// 로그아웃
router.get('/logout', controller.getLogout);

// 유저 프로필
router.get('/profile', controller.getProfile);

// 유저 프로필 수정
router.patch('/modify', controller.updateProfile);

module.exports = router;
