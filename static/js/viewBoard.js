// 각 요소 접근
const submitButton = document.getElementById('submit_comment');
const commentAuthor = document.getElementById('commentWriter');
const commentContentInput = document.getElementById('comment_content');
const commentList = document.querySelector('.comment_list');

// 게시물 수정
async function editBoard() {
  const boardSeq = document.querySelector('#boardSeq').value;
  // console.log(boardSeq);
  document.location.href = `/board/modify?boardSeq=${boardSeq}`;
}

// 게시물 목록으로 이동
function listBoard() {
  document.location.href = '/board';
}

// 게시물 삭제
async function deleteBoard() {
  const boardSeq = document.querySelector('#boardSeq').value;
  const res = await axios({
    url: '/board/remove',
    method: 'delete',
    data: { boardSeq: boardSeq },
  });
  console.log(res.data);
  if (res.data.isDelete) {
    alert(res.data.msg);
    document.location.href = '/board';
  }
}

// 댓글 등록
function submitComment() {
  let registeredComment = document.createElement('div');
  registeredComment.classList.add('commentBox', 'px-5', 'mb-3');
  registeredComment.innerHTML = `
    <div class="commentUser badge text-bg-secondary fw-bold fs-3">${commentAuthor.innerHTML}</div>
    <div class="commentContent mt-2 fs-4">${commentContentInput.value}</div>
  `;
  commentList.append(registeredComment);
  const commentContent = document.querySelector('.commentContent');
  const commentUser = document.querySelector('.commentUser');
  let cmtData = {
    commentContent: commentContent.textContent,
    commentUser: commentUser.textContent,
  };
  axios({
    url: '/comment/register',
    method: 'post',
    data: cmtData,
  }); // 등록되면 true
}

// 스터디 정보 표시
const studyCategory = document.querySelector('#studyCategory');
const category = document.querySelector("input[id='categoryID']").value;
console.log(category);
switch (category) {
  case '0':
    studyCategory.innerHTML = '# 웹';
    break;
  case '1':
    studyCategory.innerHTML = '# 앱';
    break;
  case '2':
    studyCategory.innerHTML = '# AI';
    break;
  case '3':
    studyCategory.innerHTML = '# UI / UX';
    break;
  case '4':
    studyCategory.innerHTML = '# 게임';
    break;
  case '5':
    studyCategory.innerHTML = '# 기타';
    break;
}
