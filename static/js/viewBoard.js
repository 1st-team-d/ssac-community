// 각 요소 접근
const submitButton = document.getElementById('submit_comment');
const commentAuthor = document.getElementById('commentWriter');
const commentContentInput = document.getElementById('comment_content');
const commentList = document.querySelector('.comment_list');

function submitComment() {
  let registeredComment = document.createElement('div');
  registeredComment.innerHTML = `
  <div class="commentBox mb-3">
    <div class="userName badge text-bg-secondary fw-bold fs-3">${commentAuthor.innerHTML}</div>
    <div class="commentContent mt-2 fs-4">${commentContentInput.value}</div>
  </div>
  `;
  commentList.append(registeredComment);
}
