const checkPwMsg = document.querySelector('#checkPwMsg');
const samePwMsg = document.querySelector('#samePwMsg');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');

// 새로운 비밀번호에 keyup 이벤트 추가
newPassword.addEventListener('keyup', () => {
  validPw();
  samePw();
  resetPw();
});

// 비밀번호 재입력에 keyup 이벤트 추가
confirmPassword.addEventListener('keyup', () => {
  samePw();
  resetPw();
  console.log(newPassword.value, confirmPassword.value);
});

async function editPw() {
  if (
    checkPwMsg.textContent === '' &&
    samePwMsg.textContent === '비밀번호가 일치합니다.'
  ) {
    const Pw = {
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    };
    if (confirm('회원정보를 수정하시겠습니까?')) {
      let res = await axios({
        url: '/user/modify',
        method: 'PATCH',
        data: Pw,
      });
      console.log(res.data);

      if (res.data.isConfirm && res.data.isMatch) {
        await axios({
          url: '/user/logout',
          method: 'get',
        });
        document.location.href = '/';
        // 첫 화면으로 돌아감과 동시에 로그아웃 가능할까요?
      } else if (res.data.isConfirm) {
        // 입력된 두 비밀번호가 일치하지 않음
        alert('비밀번호 확인란이 일치하지 않습니다.');
      } else {
        // 비밀번호 유효성 검사 통과 실패
        alert('비밀번호를 올바른 형식으로 작성해주세요!');
      }
    } else {
      alert('비밀번호를 확인해주세요!');
    }
  }
}

function validPw() {
  // 비밀번호 유효성 검사
  const pwTest =
    /^(?=.*[A-Za-z])(?=.*[!@#\$%\^&\*\(\)_\+\-=,./:;<>\?{}\[\]|~\\])(?=.*[0-9])\S{8,}$/;

  if (!pwTest.test(newPassword.value)) {
    checkPwMsg.textContent = '비밀번호 형식이 올바르지 않습니다.';
  } else {
    checkPwMsg.textContent = '';
  }
}

function samePw() {
  if (confirmPassword.value) {
    if (newPassword.value === confirmPassword.value) {
      samePwMsg.textContent = '비밀번호가 일치합니다.';
    } else {
      samePwMsg.textContent = '비밀번호가 일치하지 않습니다.';
    }
  }
}

function resetPw() {
  if (!confirmPassword.value && !newPassword.value) {
    samePwMsg.textContent = '';
    checkPwMsg.textContent = '';
  } else if (!newPassword.value) {
    checkPwMsg.textContent = '';
  } else if (!confirmPassword.value) {
    samePwMsg.textContent = '';
  }
}
