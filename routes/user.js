const express = require("express");
const router = express.Router();
const controller = require("../controller/Cuser");

// 회원 가입 처리
router.post("/signup", controller.postSignup);

// 로그인 처리
router.post("/signin", controller.postSignin);

module.exports = router;
