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
  ext = ext[ext.length-1];
  const extArr = ['png', 'jpg', 'pdf', 'ppt', 'doc', 'docx', 'xlsx', 'txt'];

  // console.log(ext);
  // console.log(extArr.includes(ext));

  return extArr.includes(ext) > 0 ? true : false;
}

// $('.postBtn').on('click', (event) => {
//   event.preventDefault();
//   const form = document.forms['postData'];
//   console.log(form.postTitle.value);
//   console.log(form.postContent.value);

// });

// 폼 제출 시 이 데이터를 DB에 추가하고, 백에서 게시글 목록 페이지를 렌더링
// 게시글 목록 get 할 때 data로 게시글 데이터들 뿌려주면 될듯.

// --> submit 버튼으로 설정해서 폼 자체에서 요청 보내도록 함 혹시 몰라서 남겨놓기
// 글 작성 버튼 클릭 시 등록 후 게시글 목록 페이지로 이동
// $('.postBtn').on('click', async (e) => {
//   e.preventDefault();
//   const post = document.forms['post'];
//   const data = {
//     postTitle: post.postTitle.value,
//     postWriter: post.postWriter.value,
//     postPw: post.postPw.value,
//     postContent: post.postContent.value,
//     postFile: post.postFile.value,
//   };
//   let res = await axios({
//     url: '/board/register',
//     method: 'post',
//     data: data,
//   });
//   if (res.data) {
//     document.location.href = '/board';
//   }
// });

// async function postBoard(e) {
//   e.preventDe;
//   const post = document.forms['post'];
//   const data = {
//     postTitle: post.postTitle.value,
//     postWriter: post.postWriter.value,
//     postPw: post.postPw.value,
//     postContent: post.postContent.value,
//     postFile: post.postFile.value,
//   };
//   let res = await axios({
//     url: '/board/register',
//     method: 'post',
//     data: data,
//   });
//   if (res.data) {
//     document.location.href = '/board';
//   }
// }
