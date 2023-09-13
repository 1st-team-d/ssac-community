// front js
// 로그인 기능

// 모달창 내용 초기화: 다른 모달창으로 전환 시 기존 input에 입력했던 데이터 초기화
$('.modal').on('hidden.bs.modal', function () {
  // hidden.bs.modal: 모달의 닫힘이 끝나고 실행되는 이벤트
  // 폼, 메세지 초기화
  $(this).find('form')[0].reset();
  $('.errorMsg').html('');
  $('.checkEmailMsg').html('');
});

// 메세지 나타내는 요소(div)
const errorMsg = document.querySelectorAll('.errorMsg');
const checkEmailMsg = document.querySelector('#checkEmailMsg');

// 중복인지 여부 -> 처음부터 true(중복)으로 해놔서 만약 중복체크 버튼 누르지 않을 경우 회원가입 전송이 안되게 함.
let isDuplicate = true;

// 로그인 모달 창에서 로그인 버튼 누르면 폼 전송 -> 성공하면 main.ejs 리다이렉트
async function postLogin() {
  const form = document.forms['login'];
  const loginData = {
    loginEmail: form.loginEmail.value,
    loginPw: form.loginPw.value,
  };
  // 프론트 유효성 검사
  if (!loginData.loginEmail || !loginData.loginPw) {
    // 이메일, 비밀번호 빈칸으로 로그인 시도시 에러 메세지
    errorMsg[0].innerHTML = '이메일, 비밀번호는 필수 값입니다!';
  } else {
    // *back*
    // 입력 데이터로 로그인 시도 -> response로 true, false 반환 부탁드립니다.
    let res = await axios({
      url: '/user/signin',
      method: 'post',
      data: loginData,
    });
    if (res.data.isCorrect) {
      // true -> 로그인 성공 -> 메인 화면으로 이동
      document.location.href = '/';
    } else {
      // false -> 로그인 실패 -> 에러 메세지
      errorMsg[0].innerHTML =
        '이메일 혹은 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.';
      // 로그인 모달창에서 오류 메세지 표시
    }
  }
}

// 회원가입 모달 창에서 회원가입 버튼 누르면 폼 전송 -> 성공하면 main.ejs 리다이렉트
async function postRegister() {
  // 회원가입 버튼 누르면 기존 중복체크 메세지 초기화
  checkEmailMsg.innerHTML = '';
  const form = document.forms['register'];
  const registerData = {
    registerName: form.registerName.value,
    registerEmail: form.registerEmail.value,
    registerPw: form.registerPw.value,
  };
  if (
    !registerData.registerEmail ||
    !registerData.registerPw ||
    !registerData.registerName
  ) {
    // 빈 값인지 확인
    errorMsg[1].innerHTML = '이름, 이메일, 비밀번호는 필수 값입니다!';
  } else {
    // 이메일 유효성 검사
    const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailTest.test(registerData.registerEmail)) {
      errorMsg[1].innerHTML = '이메일 형식이 올바르지 않습니다.';
      errorMsg.style.color = 'red';
    } else {
      // 비밀번호 유효성 검사
      const pwTest =
        /^(?=.*[A-Za-z])(?=.*[!@#\$%\^&\*\(\)_\+\-=,./:;<>\?{}\[\]|~\\])(?=.*[0-9])\S{8,}$/;
      if (!pwTest.test(registerData.registerPw)) {
        errorMsg[1].innerHTML =
          '비밀번호는 대소문자, 특수문자, 숫자를 포함한 8자리 이상';
      } else {
        // 중복체크 하지 않았을 경우
        if (isDuplicate) {
          errorMsg[1].innerHTML = '이메일 중복체크를 해주세요.';
        } else {
          // *back*
          // 회원가입 성공시 true, 실패시 false 응답 해주세요. 아마 다 true 뜰듯?
          let res = await axios({
            url: '/user/signup',
            method: 'post',
            data: registerData,
          });
          if (res.data) {
            // true -> 회원가입 성공 -> 메인 화면으로 이동
            document.location.href = '/';
          }
        }
      }
    }
  }
}

// 이메일 중복체크
async function checkDuplicate(btn) {
  errorMsg[1].innerHTML = '';
  const form = document.forms['register'];
  const registerEmail = form.registerEmail.value;
  // *back*
  // 입력한 이메일로 중복 체크 -> 중복 아니면 true, 중복이면 false 응답 부탁드려요
  // 이메일 형식 유효성 검사
  const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailTest.test(registerEmail)) {
    checkEmailMsg.innerHTML = '이메일 형식이 올바르지 않습니다.';
    checkEmailMsg.classList.add('errorMsg');
  } else {
    let res = await axios({
      url: '/user/checkEmail',
      method: 'post',
      data: registerEmail,
    });
    if (res.data) {
      checkEmailMsg.innerHTML = '사용 가능한 이메일입니다.';
      checkEmailMsg.classList.add('errorMsg');
      isDuplicate = false;
    } else {
      checkEmailMsg.innerHTML =
        '이미 사용중인 이메일입니다. 다른 이메일을 입력 해주세요.';
      checkEmailMsg.classList.add('errorMsg');
      isDuplicate = true;
    }
  }
}
