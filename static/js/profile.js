const checkPwMsg = document.querySelector('#checkPwMsg');

async function editPw() {
  const Pw = {
    newPassword: document.getElementById('newPassword').value,
    confirmPassword: document.getElementById('confirmPassword').value,
  };

  //   const form = document.forms['form-horizontal'];
  //   console.log('newPw', newPassword.value);

  // 비밀번호 유효성 검사
  const pwTest =
    /^(?=.*[A-Za-z])(?=.*[!@#\$%\^&\*\(\)_\+\-=,./:;<>\?{}\[\]|~\\])(?=.*[0-9])\S{8,}$/;

  if (!pwTest.test(newPassword.value)) {
    checkPwMsg.innerHTML = '이메일 형식이 올바르지 않습니다.';
  } else {
    let res = await axios({
      url: '/user/modify',
      method: 'PATCH',
      data: Pw,
    });

    if (res.data.isConfirm && res.data.isMatch) {
      document.location.reload();
      // 첫 화면으로 돌아감과 동시에 로그아웃 가능할까요?
    } else if (res.data.isConfirm || res.data.isMatch) {
      if (res.data.isMatch) {
        // 비밀번호 유효성 검사 통과 실패
      } else {
        // 입력된 두 비밀번호가  일치하지 않음
      }
    }
  }
}
