// User 모델 모듈 불러오기
const { User } = require("../models");
// bcrypt 패키지 불러오기
const { hashedPw, comparePw } = require("../utils/encrypt");

// 회원가입 처리 - 진행 중
exports.postSignup = async (req, res) => {
  // Todo: 유효성 검사(아이디 중복, 비밀번호 공백 확인)

  try {
    // 회원가입 요청 시, 암호화된 비밀번호 DB 추가
    const { registerName, registerEmail, registerPw } = req.body;

    const hashedPW = await hashedPw(registerPw); // 비밀번호 암호화
    await User.create({ id: registerEmail, pw: hashedPW, name: registerName }); // DB 추가

    res.send({ isSignup: true });
  } catch (err) {
    console.error(err);
    res.send({ isSignup: false });
  }
};

// 로그인 처리 - 진행 중
exports.postSignin = async (req, res) => {
  // 1. 아이디를 찾아서 사용자 존재 유무 확인
  const { loginEmail, loginPw } = req.body;

  const user = await User.fineOne({
    where: { id: loginEmail },
  });

  // 2. 입력된 비밀번호 암호화하여 DB의 정보와 비교
};
