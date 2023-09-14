// User 모델 모듈 불러오기
const express = require("express");
const { User } = require("../models");
// bcrypt 패키지 불러오기
const { hashedPw, comparePw } = require("../utils/encrypt");

// 이메일(아이디) 유효성 검사 함수
const checkEmail = async (email) => {
  const regexrEmail = /[\w\-\.]+\@[\w\-\.]+/g; // aaa@bbb.com

  if (email.match(regexrEmail)) {
    return true; // 형식 통과
  } else {
    return false; // 형식 실패
  }
};

// 비밀번호 유효성 검사 함수
const checkPw = async (pw) => {
  const regexrPw = /\s/g; // 공백, 탭

  if (pw.match(regexrPw)) {
    return false; // gap 존재
  } else {
    return true; // gap 존재 X
  }
};

// 회원가입 처리
exports.postSignup = async (req, res) => {
  try {
    // 회원가입 요청 시, 암호화된 비밀번호 DB 추가
    const { registerName, registerEmail, registerPw } = req.body;

    // 이메일(아이디) 유효성 검사(형식 확인)
    isCorrect = await checkEmail(registerEmail);
    // 비밀번호 유효성 검사(공백 확인)
    isNoGap = await checkPw(registerPw);

    if (isCorrect && isNoGap) {
      // 이메일(아이디), 비밀번호 유효성 검사 통과
      const hashedPW = await hashedPw(registerPw); // 비밀번호 암호화
      await User.create({
        id: registerEmail,
        pw: hashedPW,
        name: registerName,
      }); // DB 추가

      res.send({ isCorrect, isSignup: true });
    } else {
      // 이메일(아이디), 비밀번호 유효성 검사 통과 실패
      res.send({ isCorrect, isNoGap });
    }
  } catch (err) {
    console.error(err);
    res.send({ isSignup: false, msg: "회원가입 실패" });
  }
};

// 이메일(아이디) 중복 확인
exports.postCheckEmail = async (req, res) => {
  try {
    // 이메일(아이디)를 찾아서 회원 존재 유무 확인
    const { registerEmail } = req.body;

    // 이메일(아이디) 유효성 검사(형식 확인)
    isCorrect = await checkEmail(registerEmail);

    // DB 접근
    const user = await User.findOne({
      where: { id: registerEmail },
    });

    if (isCorrect) {
      // 이메일(아이디) 유효성 검사 통과
      if (user) {
        // 이메일(아이디)가 중복되는 경우
        res.send({ isCorrect, isCheck: false, msg: "이메일이 중복입니다!" });
      } else {
        // 이메일(아이디)가 중복되지 않는 경우
        res.send({
          isCorrect,
          isCheck: true,
          msg: "이메일이 중복되지 않습니다!",
        });
      }
    } else {
      // 이메일(아이디) 유효성 검사 통과 실패
      res.send({ isCorrect });
    }
  } catch (err) {
    console.error(err);
    res.send({ isCheck: false, msg: "중복 확인 실패" });
  }
};

// 로그인 처리
exports.postSignin = async (req, res) => {
  // Todo: 필요한 세션 정보 확인

  try {
    // 1. 이메일(아이디)를 찾아서 회원 존재 유무 확인
    const { loginEmail, loginPw } = req.body;

    // 이메일(아이디) 유효성 검사(형식 확인)
    isCorrect = await checkEmail(loginEmail);
    // 비밀번호 유효성 검사(공백 확인)
    isNoGap = await checkPw(loginPw);

    if (isCorrect && isNoGap) {
      // 비밀번호 유효성 통과
      // DB 접근
      const user = await User.findOne({
        where: { id: loginEmail },
      });

      // 2. 입력된 비밀번호 암호화하여 DB의 정보와 비교
      if (user) {
        // 회원 있음
        // 입력된 비밀번호와 DB 정보와 비교 결과 - true / false
        const compareResult = await comparePw(loginPw, user.pw);

        if (compareResult) {
          // 비밀번호 일치
          req.session.userInfo = {
            name: user.name,
            id: user.id,
            userSeq: user.userSeq,
          }; // 회원 정보 세션 생성

          console.log("sessioninfo >>>>>", req.session);

          res.send({
            isCorrect,
            isNoGap,
            isSignin: true,
            data: user,
          });
        } else {
          // 비밀번호 불일치
          res.send({
            isCorrect,
            isNoGap,
            isSignin: false,
            msg: "비밀번호가 틀림",
          });
        }
      } else {
        // 회원 없음
        res.send({
          isCorrect,
          isNoGap,
          isSignin: false,
          msg: "사용자가 존재하지 않음",
        });
      }
    } else {
      // 이메일(아이디), 비밀번호 유효성 검사 통과 실패
      res.send({ isCorrect, isNoGap });
    }
  } catch (err) {
    console.error(err);
    res.send({ isSignin: false, msg: "로그인 실패" });
  }
};
