// 페이지당 게시물 수와 현재 페이지 번호
const itemsPerPage = 5; // 한 페이지에 표시할 게시물 수
let currentPage = 1; // 현재 페이지 번호
// 게시물을 동적으로 생성하고 표시하는 함수
function renderBoard() {
  const boardList = document.getElementById('boardList');
  boardList.innerHTML = ''; // 이전 게시물 목록 초기화
  // 게시물 데이터를 역순으로 정렬하여 최신 게시물이 제일 위에 표시되도록
  const reversedData = boardData.slice().reverse();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = reversedData.slice(startIndex, endIndex);
  // 각 게시물 데이터를 HTML 요소로 변환하여 게시판 목록에 추가
  paginatedData.forEach((item) => {
    const boardItem = document.createElement('div');
    boardItem.innerHTML = `
      <div class="num">${item.num}</div>
      <div class="title">
        <a href="#" class="view-link" data-id="${item.num}">${item.title}</a>
      </div>
      <div class="writer">${item.writer}</div>
      <div class="date">${item.date}</div>
      <div class="count">${item.count}</div>
    `;
    boardList.appendChild(boardItem);
  });
  // 게시물 제목 링크에 클릭 이벤트 리스너 추가
  const viewLinks = boardList.querySelectorAll('.view-link');
  viewLinks.forEach((viewLink) => {
    viewLink.addEventListener('click', (event) => {
      event.preventDefault(); // 링크의 기본 동작 방지
      const postId = event.target.getAttribute('data-id'); // 게시물 ID 가져오기
      // postId를 사용하여 조회 페이지로 이동
      window.location.href = `/viewBoard.ejs?id=${postId}`;
    });
  });
}
// 페이지 번호를 생성하고 표시하는 함수
function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = ''; // 이전 페이지 번호 초기화
  const totalPages = Math.ceil(boardData.length / itemsPerPage);
  // 페이지 번호를 생성하고 클릭 이벤트를 연결하여 페이지를 변경할 때마다 업데이트
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.addEventListener('click', () => {
      currentPage = i; // 페이지 번호 변경
      renderBoard(); // 게시물 목록 업데이트
      renderPagination(); // 페이지 번호 업데이트
    });
    // 현재 페이지에 'on' 클래스를 추가하여 활성화된 페이지를 표시
    if (i === currentPage) {
      pageLink.classList.add('num', 'on');
    } else {
      pageLink.classList.add('num');
    }
    // 페이지 번호를 페이지네이션 컨테이너에 추가
    pagination.appendChild(pageLink);
  }
}
// 검색 창과 검색 버튼 요소 가져오기
const searchInput = document.querySelector(".search_box input[type='text']");
const searchButton = document.querySelector('.search_box button');
// 검색 버튼 클릭 시 검색 기능 실행
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim(); // 입력된 검색어 얻기 (양쪽 공백 제거)
  // 검색어가 비어 있으면 모든 게시물을 표시하고 페이지 번호를 초기화
  if (searchTerm === '') {
    currentPage = 1; // 현재 페이지 초기화
    renderBoard(); // 모든 게시물을 표시
    renderPagination(); // 페이지 번호 초기화
  } else {
    // 검색어가 비어 있지 않으면 검색 기능 실행
    const searchResult = boardData.filter((item) => {
      // 제목 또는 작성자에 검색어가 포함된 게시물을 필터링
      return (
        item.title.includes(searchTerm) || item.writer.includes(searchTerm)
      );
    });
    // 검색 결과를 업데이트하고 페이지 번호 초기화
    boardData.length = 0; // 기존 게시물 데이터 초기화
    Array.prototype.push.apply(boardData, searchResult); // 검색 결과로 데이터 업데이트
    currentPage = 1; // 현재 페이지 초기화
    renderBoard(); // 검색 결과 게시물 표시
    renderPagination(); // 페이지 번호 초기화
  }
});
// // 초기 페이지 렌더링
// renderBoard(); // 게시물 목록 생성 및 표시
// renderPagination(); // 페이지 번호 생성 및 표시
