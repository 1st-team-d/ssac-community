// front js
// 로그인 기능

// 모달창 내용 초기화: 다른 모달창으로 전환 시 기존 input에 입력했던 데이터 초기화
$('.modal').on('hidden.bs.modal', function () {
  $(this).find('form')[0].reset();
});

// 메세지 나타내는 요소(div)
const errorMsg = document.querySelectorAll('.errorMsg');
const checkEmailMsg = document.querySelector('#checkEmailMsg');

// 사용자가 input 값 변경할 때 change 이벤트 발생
// const loginEmail = document.querySelector('#loginEmail');
// const loginPw = document.querySelector('#loginPw');
// loginEmail.addEventListener('change', () => {
//   errorMsg.remove();
// });
// loginPw.addEventListener('change', () => {
//   errorMsg.remove();
// });

// 로그인 모달 창에서 로그인 버튼 누르면 폼 전송 -> 성공하면 main.ejs 리다이렉트
async function postLogin() {
  const form = document.forms['login'];
  const loginData = {
    email: form.loginEmail.value,
    pw: form.loginPw.value,
  };
  // 프론트 유효성 검사
  if (!loginData.email || !loginData.pw) {
    errorMsg[0].innerHTML = '이메일, 비밀번호는 필수 값입니다!';
  } else {
    // const res = await axios({
    //   url: '/login',
    //   method: 'post',
    //   data: loginData,
    // });
    res = { data: true };
    if (res.data) {
      // true -> 로그인 성공 -> 메인 화면으로 이동
      document.location.href = '/';
    } else {
      errorMsg.innerHTML = '로그인 실패! 올바른 정보를 입력해주세요 :)';
      // 로그인 모달창에서 오류 메세지 표시
    }
  }
}

// 회원가입 모달 창에서 회원가입 버튼 누르면 폼 전송 -> 성공하면 main.ejs 리다이렉트
async function postRegister() {
  const form = document.forms['register'];
  const registerData = {
    name: form.registerName.value,
    email: form.registerEmail.value,
    pw: form.registerPw.value,
  };
  if (!registerData.email || !registerData.pw || !registerData.name) {
    errorMsg[1].innerHTML = '이름, 이메일, 비밀번호는 필수 값입니다!';
  } else {
    // const res = await axios({
    //   url: '/register',
    //   method: 'post',
    //   data: registerData,
    // });
    res = { data: false };
    if (res.data) {
      // true -> 회원가입 성공 -> 메인 화면으로 이동
      document.location.href = '/';
    }
  }
}

// 이메일 중복체크
async function checkDuplicate(btn) {
  const form = document.forms['register'];
  const email = form.registerEmail.value;
  // const res = await axios({
  //   url: '/checkemail',
  //   method: 'post',
  //   data: email,
  // });
  res = { data: true };
  if (res.data) {
    checkEmailMsg.innerHTML = '사용 가능한 이메일입니다!';
    btn.innerHTML = '중복체크 완료';
  } else {
    checkEmailMsg.innerHTML = '다른 이메일을 입력 해주세요!';
  }
}
