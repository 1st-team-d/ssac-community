const express = require("express");
const router = express.Router();
const controller = require("../controller/Cuser");

// 회원 가입 처리
router.post("/signup", controller.postSignup);

// 이메일 중복 확인
router.post("/checkEmail", controller.postCheckEmail);

// 로그인 처리
router.post("/signin", controller.postSignin);

// 모든 유저 조회
// 특정 유저 조회
// 유저 검색
// 유저 수정
// 유저 삭제

module.exports = router;
