// 파일 input 업로드하면 text input에 파일명 표시
$('#postFile').on('change', function () {
  let fileName = $('#postFile').val();
  const ext = checkExt(fileName); // 확장자 체크

  if (ext) {
    $('.fileName').val(fileName.split('\\')[2]);
    return true;
  } else {
    alert('확장자는 png, jpg, pdf, ppt, doc, docx, xlsx, txt만 가능합니다!');
    return false;
  }
});

// 게시글 submit 전에 유효성 검사
const postBtn = document.querySelector('.postBtn');
if (postBtn) {
  postBtn.addEventListener('click', function (e) {
    e.preventDefault();
    // check
    const form = document.forms['data'];
    const title = form.title.value;
    const content = form.content.value;
    const category = form.category.value;
    const maxPeople = form.maxPeople.value;

    if (!title) {
      alert('제목은 필수입니다!');
    } else if (!content) {
      alert('내용은 필수입니다!');
    } else if (!category) {
      alert('카테고리 선택은 필수입니다!');
    } else if (!maxPeople) {
      alert('최대인원 설정은 필수입니다!');
    } else {
      form.submit();
    }
  });
}

// 확장자 체크
function checkExt(fileName) {
  let ext = fileName.split('.');
  ext = ext[ext.length - 1];
  const extArr = ['png', 'jpg', 'pdf', 'ppt', 'doc', 'docx', 'xlsx', 'txt'];

  return extArr.includes(ext) > 0 ? true : false;
}

// 수정 버튼
async function editPost() {
  if (validationForm()) {
    const form = document.forms['data'];
    const formData = new FormData();
    const file = document.querySelector('#postFile').files[0];

    formData.append('boardSeq', form.boardSeq.value);
    formData.append('userSeq', form.userSeq.value);
    formData.append('studySeq', form.studySeq.value);
    formData.append('title', form.title.value);
    formData.append('content', form.content.value);
    formData.append('category', form.category.value);
    formData.append('maxPeople', form.maxPeople.value);
    formData.append('uploadFile', file);

    if (confirm('수정 하시겠습니까?')) {
      try {
        const res = await axios({
          url: '/board/modify',
          method: 'patch',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data; charset: UTF-8',
          },
        });
        if (res.data) {
          alert('수정 완료!');
          document.location.href = '/board';
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// 카테고리 선택 시 색상 달라지게
const radioInputs = document.querySelectorAll(
  '.categories input[type="radio"]'
);
const labels = document.querySelectorAll('.categories label');

// 라디오 인풋에 클릭 이벤트를 감지하여 처리
radioInputs.forEach((radioInput, index) => {
  radioInput.addEventListener('click', function () {
    // 어떤 라디오 인풋을 클릭했을 때 모든 라디오 인풋의 클래스를 제거
    labels.forEach((label) => {
      label.classList.remove('checked');
    });

    // 클릭된(index에 해당하는) input에 해당하는 label 요소에 checked 클래스 추가
    labels[index].classList.add('checked');
  });
});

// 최대 인원 -> tagify 라이브러리 사용
let input = document.querySelector('input[name=maxPeople]');
let tagify = new Tagify(input, {
  // whiteList 외에 다른 값 선택 못하게
  enforceWhitelist: true,
  mode: 'select',
  value: '5',
  whitelist: ['5', '6', '7', '8', '9', '10'],
});

// 유효성 검사
function validationForm() {
  const maxPeople = document.querySelector('input[name=maxPeople]'); // 최대 인원
  const checkedLabelId = document.querySelector('.checked').getAttribute('for'); // 카테고리(선택됨) // 라벨 태그에 checked가 있음
  const category = document.querySelector(`#${checkedLabelId}`);

  // 최대 인원
  if (!maxPeople.value) {
    alert('최대 인원을 선택해주세요.');
    return false;
  }
  // 카테고리
  if (!category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  return true;
}
