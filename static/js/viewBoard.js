// 각 요소 접근
const submitButton = document.getElementById('submit_comment');
const commentAuthor = document.getElementById('commentWriter');
const commentContentInput = document.getElementById('comment_content');
const commentList = document.querySelector('.comment_list');

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
