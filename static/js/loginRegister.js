// front js
// 로그인 기능

// 모달창 내용 초기화: 다른 모달창으로 전환 시 기존 input에 입력했던 데이터 초기화
$('.modal').on('hidden.bs.modal', function () {
  $(this).find('form')[0].reset();
});

// 로그인 모달 창에서 로그인 버튼 누르면 폼 전송 -> 성공하면 main.ejs 리다이렉트
async function postLogin() {
  const form = document.forms['login'];
  const loginData = {
    email: form.loginEmail.value,
    pw: form.loginPw.value,
  };
  console.log(loginData);
  const res = await axios({
    url: '/login',
    method: 'post',
    data: loginData,
  });
  if (res.data) {
    document.location.href = '/';
  } else {
    // 로그인 모달창에서 오류 메세지 표시
  }
}

// 회원가입 모달 창에서 회원가입 버튼 누르면 폼 전송 -> 성공하면 main.ejs 리다이렉트
async function postRegister() {
  const form = document.forms['register'];
  const registerData = {
    email: form.registerEmail.value,
    pw: form.registerPw.value,
  };
  console.log(registerData);
  const res = await axios({
    url: '/register',
    method: 'post',
    data: registerData,
  });
  if (res.data) {
    alert('회원가입 완료!');
    document.location.href = '/';
  } else {
    // 로그인 모달창에서 오류 메세지 표시
  }
}
