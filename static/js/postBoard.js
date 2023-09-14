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
