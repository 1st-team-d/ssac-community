// front js
// 로그인 기능

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
