document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit_comment");
  const commentAuthorInput = document.getElementById("comment_author");
  const commentContentInput = document.getElementById("comment_content");
  const commentList = document.querySelector(".comment_list");
  let commentIdCounter = 1;

  // 수정 중인 댓글을 저장하는 변수
  let editingComment = null;

  submitButton.addEventListener("click", function (e) {
    e.preventDefault();

    const author = commentAuthorInput.value;
    const content = commentContentInput.value;

    if (!author || !content) {
      alert("댓글 작성자와 내용을 입력하세요.");
      return;
    }

    if (editingComment) {
      // 수정 중인 댓글을 업데이트
      editingComment.querySelector(".comment_author").textContent = author;
      editingComment.querySelector(".comment_content").textContent = content;
      editingComment = null; // 수정 완료 후 초기화
    } else {
      // 새 댓글을 생성
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment_item");
      commentItem.innerHTML = `
              <div class="comment_author">${author}</div>
              <div class="comment_content">${content}</div>
              <div class="comment_controls">
                <button class="edit_comment">수정</button>
                <button class="delete_comment">삭제</button>
              </div>
            `;

      const commentId = `comment_${commentIdCounter}`;
      commentItem.setAttribute("id", commentId);

      // 새 댓글을 목록의 마지막에 추가
      commentList.insertBefore(commentItem, null);

      commentIdCounter++;
    }

    commentAuthorInput.value = "";
    commentContentInput.value = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 삭제 버튼 클릭 시 해당 댓글 삭제
  commentList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete_comment")) {
      const commentItem = e.target.closest(".comment_item");
      commentList.removeChild(commentItem);
    }

    if (e.target.classList.contains("edit_comment")) {
      // 수정 버튼을 클릭한 경우
      const commentItem = e.target.closest(".comment_item");
      const author = commentItem.querySelector(".comment_author").textContent;
      const content = commentItem.querySelector(".comment_content").textContent;

      // 수정 중인 댓글의 내용을 입력란에 채우기
      commentAuthorInput.value = author;
      commentContentInput.value = content;

      // 수정 중인 댓글을 저장
      editingComment = commentItem;
    }
  });
});
