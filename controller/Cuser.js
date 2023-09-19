// User 모델 모듈 불러오기
const { User } = require('../models');
// bcrypt 패키지 불러오기
const { hashedPw, comparePw } = require('../utils/encrypt');

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

    // 이름 유효성 검사(공백 확인)
    isNoGapName = await checkPw(registerName);
    // 이메일(아이디) 유효성 검사(형식 확인)
    isCorrect = await checkEmail(registerEmail);
    // 비밀번호 유효성 검사(공백 확인)
    isNoGapPw = await checkPw(registerPw);

    if (isNoGapName && isCorrect && isNoGapPw) {
      // 이메일(아이디), 비밀번호 유효성 검사 통과
      const hashedPW = await hashedPw(registerPw); // 비밀번호 암호화
      await User.create({
        id: registerEmail,
        pw: hashedPW,
        name: registerName,
        // isAdmin: 1, // 관리자 추가 시 필요
      }); // DB 추가

      res.send({ isCorrect, isSignup: true, session: req.session.userInfo });
    } else {
      // 이름, 이메일(아이디), 비밀번호 유효성 검사 통과 실패
      res.send({ isCorrect, isNoGapPw });
    }
  } catch (err) {
    console.error(err);
    res.send({ isSignup: false, msg: '회원가입 실패' });
  }
};

// 닉네임 중복 확인
exports.postCheckName = async (req, res) => {
  try {
    // 닉네임을 찾아서 회원 존재 유무 확인
    const { registerName } = req.body;

    // 닉네임 유효성 검사(형식 확인)
    isCorrect = await checkPw(registerName);

    // DB 접근
    const user = await User.findOne({
      where: { name: registerName },
    });

    console.log('이름 중복 정보 >>>>>>>>>>>>>>', user);

    if (isCorrect) {
      // 닉네임 유효성 검사 통과
      if (user) {
        // 닉네임이 중복되는 경우
        res.send({ isCorrect, isCheck: false, msg: '이메일이 중복입니다!' });
      } else {
        // 닉네임이 중복되지 않는 경우
        res.send({
          isCorrect,
          isCheck: true,
          msg: '이메일이 중복되지 않습니다!',
        });
      }
    } else {
      // 닉네임 유효성 검사 통과 실패
      res.send({ isCorrect });
    }
  } catch (err) {
    console.error(err);
    res.send({ isCheck: false, msg: '중복 확인 실패' });
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

    console.log('이메일 중복 정보 >>>>>>>>>>>>>>', user);

    if (isCorrect) {
      // 이메일(아이디) 유효성 검사 통과
      if (user) {
        // 이메일(아이디)가 중복되는 경우
        res.send({ isCorrect, isCheck: false, msg: '이메일이 중복입니다!' });
      } else {
        // 이메일(아이디)가 중복되지 않는 경우
        res.send({
          isCorrect,
          isCheck: true,
          msg: '이메일이 중복되지 않습니다!',
        });
      }
    } else {
      // 이메일(아이디) 유효성 검사 통과 실패
      res.send({ isCorrect });
    }
  } catch (err) {
    console.error(err);
    res.send({ isCheck: false, msg: '중복 확인 실패' });
  }
};

// 로그인 처리
exports.postSignin = async (req, res) => {
  try {
    // 1. 이메일(아이디)를 찾아서 회원 존재 유무 확인
    const { loginEmail, loginPw, loginRemain } = req.body;

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
      console.log(user);

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
            isAdmin: user.isAdmin,
          }; // 회원 정보 세션 생성

          console.log('sessioninfo >>>>>', req.session.userInfo);

          // 로그인 정보 기억
          const myCookieConf = {
            httpOnly: true,
            maxAge: 86400 * 1000, // 1day
            signed: true, // 암호화 쿠키
          };

          // 로그인 정보 기억하기
          if (loginRemain) {
            res.cookie('remain', { loginEmail, loginPw }, myCookieConf);
          }

          const cookie = req.signedCookies.remain;

          res.send({
            isCorrect,
            isNoGap,
            isSignin: true,
            data: user,
            session: req.session.userInfo,
            cookieEmail: cookie ? cookie.loginEmail : '',
            cookiePw: cookie ? cookie.loginPw : '',
          });
        } else {
          // 비밀번호 불일치
          res.send({
            isCorrect,
            isNoGap,
            isSignin: false,
            msg: '비밀번호가 틀림',
          });
        }
      } else {
        // 회원 없음
        res.send({
          isCorrect,
          isNoGap,
          isSignin: false,
          msg: '사용자가 존재하지 않음',
        });
      }
    } else {
      // 이메일(아이디), 비밀번호 유효성 검사 통과 실패
      res.send({ isCorrect, isNoGap });
    }
  } catch (err) {
    console.error(err);
    res.send({ isSignin: false, msg: '로그인 실패' });
  }
};

exports.getLogout = async (req, res) => {
  try {
    if (req.session.userInfo) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    }
    // 로그인 정보가 있을 때만 로그아웃 처리 가능하게
    // 로그인 정보가 없는 사용자가 주소창에 /user/logout 누르면 홈으로 리다이렉트
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send({ isLogout: false, msg: '로그아웃 실패' });
  }
};
