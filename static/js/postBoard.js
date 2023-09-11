// 파일 input 업로드하면 text input에 파일명 표시
$('#postFile').on('change', function () {
  let fileName = $('#postFile').val();
  $('.upload-name').val(fileName.split('\\')[2]);
});

// 글 작성 버튼 클릭 시 등록 후 게시글 목록 페이지로 이동
async function postBoard() {
  const post = document.forms['post'];
  const data = {
    postTitle: post.postTitle.value,
    postWriter: post.postWriter.value,
    postPw: post.postPw.value,
    postContent: post.postContent.value,
    postFile: post.postFile.value,
  };
  const res = await axios({
    url: '/board/register',
    method: 'post',
    data: data,
  });
  if (res.data) {
    document.location.href = '/board';
  }
}
