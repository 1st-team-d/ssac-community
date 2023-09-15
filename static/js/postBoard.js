// 파일 input 업로드하면 text input에 파일명 표시
$('#postFile').on('change', function () {
  let fileName = $('#postFile').val();
  // console.log(fileName);

  const ext = checkExt(fileName); // 확장자 체크

  if (ext) {
    $('.fileName').val(fileName.split('\\')[2]);
    return true;
  } else {
    alert('확장자는 png, jpg, pdf, ppt, doc, docx, xlsx, txt만 가능합니다!');
    return false;
  }
});

// 확장자 체크
function checkExt(fileName) {
  let ext = fileName.split('.');
  ext = ext[ext.length - 1];
  const extArr = ['png', 'jpg', 'pdf', 'ppt', 'doc', 'docx', 'xlsx', 'txt'];

  // console.log(ext);
  // console.log(extArr.includes(ext));

  return extArr.includes(ext) > 0 ? true : false;
}

// 수정 버튼
async function editPost() {
  const form = document.forms['data'];
  const formData = new FormData();
  const file = document.querySelector('#postFile').files[0];

  console.log(form.boardSeq.value);

  formData.append('boardSeq', form.boardSeq.value);
  formData.append('userSeq', form.userSeq.value);
  formData.append('title', form.title.value);
  formData.append('content', form.content.value);
  formData.append('uploadFile', file);

  if (confirm('수정 하시겠습니까?')) {
    try {
      const res = await axios({
        url: '/board/modify',
        method: 'patch',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        alert('수정 완료!');
        document.location.href = '/board';
      }
    } catch (error) {
      console.error(error);
      // 에러 처리 로직 추가
    }
  }
}
