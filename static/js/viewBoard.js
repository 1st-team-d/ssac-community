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
async function submitComment() {
  // boardSeq
  const boardSeq = document.querySelector('#boardSeq').value;
  // 댓글 관련 각 요소 접근
  // const commentAuthor = document.getElementById('commentWriter');
  const commentContentInput = document.getElementById(
    'comment_content_textarea'
  );
  // const commentList = document.querySelector('.comment_list');
  let cmtData = {
    postID: boardSeq,
    cmtContent: commentContentInput.value,
  };
  const res = await axios({
    url: '/comment/register',
    method: 'post',
    data: cmtData,
  }); // 등록되면 true
  console.log(res.data);
  if (res.data.result) {
    document.location.reload();
  } else {
    alert('다시 댓글 써라 ㅋㅋ');
  }
}

// 댓글 삭제
async function deleteCmt(commentSeq) {
  const boardSeq = document.querySelector('#boardSeq').value;
  if (confirm('삭제 하시겠습니까?')) {
    const res = await axios({
      url: '/comment/remove',
      method: 'delete',
      data: { commentSeq: commentSeq, postID: boardSeq },
    });
    if (res.data.result) {
      document.location.reload();
    }
  }
}

// 댓글 수정창 이동
function editCmt(commentSeq) {
  // commentSeq 에 해당하는 commentBox(각 댓글 감싸는거) 요소 선택
  const cmt = document.querySelector(`.Cmt${commentSeq}`);
  const cmtUser = document.querySelector(
    `.Cmt${commentSeq} > .commentUser`
  ).textContent;
  const cmtContent = document.querySelector(
    `.Cmt${commentSeq} > .commentContent`
  ).textContent;
  cmt.innerHTML = `
  <div class="editCmtWrap w-100">
    <div class="editCmtInput d-flex flex-column">
      <div class="editCmtUser mx-4 my-3"><span>${cmtUser}</span></div>
      <div class="editCmtContent mx-3 d-flex justify-content-center">
        <textarea class="p-2 w-100" name="editCmtContent" id="editCmtContent<%= cmt.commentSeq %>" autofocus>${cmtContent.trim()}</textarea>
      </div>
      <div class="editBtnWrap d-flex justify-content-end my-3 me-3">
        <button class="patchCommentBtn btn me-1" onclick="patchComment(${commentSeq}, this)">수정</button>
        <button class="cancelEditBtn btn" onclick="cancelComment(${commentSeq})">취소</button>
      </div>
    </div>
  </div>
  `;
}

// 댓글 수정 취소 -> cmtSeq 하나의 데이터 조회하는 것도 필요
async function cancelComment(cmtSeq) {
  const cmt = document.querySelector(`.Cmt${cmtSeq}`);
  const res = await axios({
    url: '/comment/cancel',
    method: 'get',
    params: { commentSeq: cmtSeq },
  });
  if (res.data.result) {
    cmt.innerHTML = `
    <div class="commentUser badge text-bg-secondary fw-bold">
      ${res.data.oneComment.user.name}
    </div>
    <div class="commentContent ms-1 mt-2">
      ${res.data.oneComment.content}
    </div>
    <div class="cmtBtnWrap">
      <button class="editCmtBtn btn" onclick="editCmt(${cmtSeq})">수정</button>
      <button class="deleteCmtBtn btn" onclick="deleteCmt(${cmtSeq})">삭제</button>
    </div>
    `;
  } else {
    alert('그럴일 없지롱~~~');
  }
}

// 댓글 수정 요청 -> patch /comment/modify
async function patchComment(cmtSeq, editBtn) {
  const cmtContent =
    editBtn.parentElement.previousElementSibling.firstElementChild.value;
  console.log(cmtContent);
  const cmtData = { commentSeq: cmtSeq, cmtContent: cmtContent };
  if (confirm('댓글을 수정하시겠습니까?')) {
    const res = await axios({
      url: '/comment/modify',
      method: 'patch',
      data: cmtData,
    });
    if (res.data.result) {
      document.location.reload();
    }
  }
}

// 댓글 삭제 요청 -> delete /comment/remove
async function deleteComment(cmtSeq) {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    const res = await axios({
      url: '/comment/remove',
      method: 'delete',
      data: { commentSeq: cmtSeq },
    });
    if (res.data.result) {
      document.location.reload();
    }
  }
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

// 스터디 신청 & 마감
async function studyCloseApply(btn) {
  // 스터디 시퀀스
  const studySeq = document.querySelector('#studySeq').value;
  // 로그인 한 사람 -> 신청자
  const userSeq = document.querySelector('#userSeq').value;
  console.log('헤헤', studySeq, '바보', userSeq);
  console.log(btn.textContent);
  let studyClose = {
    studySeq: studySeq,
  };
  let studyApply = {
    studySeq: studySeq,
    userSeq: userSeq,
  };
  if (btn.textContent === '스터디 모집 마감하기') {
    if (confirm('스터디 모집을 마감하시겠습니까?')) {
      try {
        const res = await axios({
          url: '/study/close',
          method: 'patch',
          data: studyClose,
        });
        if (res.data.msg === 'success') {
          document.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    }
  } else if (btn.textContent === '스터디 참가 신청하기') {
    if (userSeq) {
      if (confirm('스터디 참가 신청을 하시겠습니까?')) {
        try {
          const res = await axios({
            url: '/study/apply',
            method: 'patch',
            data: studyApply,
          });
          if (res.data.msg === 'success') {
            document.location.reload();
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      alert('로그인 후 신청 해주세요!');
      $('#loginModal').modal('show');
    }
  }
}
