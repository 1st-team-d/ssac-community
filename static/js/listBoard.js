const itemsPerPage = 5; // 한 페이지에 표시할 게시물 수
// 페이지당 게시물 수와 현재 페이지 번호
let currentPage = 1; // 현재 페이지 번호
// 게시물을 동적으로 생성하고 표시하는 함수

function renderBoard() {
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
  // 페이지 번호를 생성하고 클릭 이벤트를 연결하여 페이지를 변경할 때마다 업데이트
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.addEventListener('click', () => {
      currentPage = i; // 페이지 번호 변경
      const res = axios({
        url: '/board',
        method: 'get',
        params: { pageNum: currentPage },
      });
      const totalPages = Math.ceil(Object.keys(obj).length / itemsPerPage);
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

// 페이지 번호 변경
async function changePageNum(pageNum) {
  await axios({
    url: '/board',
    method: 'get',
    params: { pageNum: pageNum },
  });
}

// 검색 버튼 요소 가져오기
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
// 검색 버튼 클릭 이벤트 리스너 추가
searchButton.addEventListener('click', () => {
  // 입력된 검색어 가져오기
  const keyword = searchInput.value;
  // 검색어를 서버로 전송하여 검색 요청 보내기
  fetch(`/board?search=${keyword}`)
    .then((response) => response.json()) // 서버 응답을 JSON으로 파싱
    .then((data) => {
      // 검색 결과를 받아와서 화면에 표시
      console.log('검색 결과 데이터:', data); // 이 부분을 추가하여 데이터를 콘솔에 출력
      renderSearchResults(data.data);
    })
    .catch((error) => {
      console.error('검색 오류:', error);
    });
});
// 검색 결과를 화면에 표시하는 함수
function renderSearchResults(results) {
  console.log(results);
  const boardList = document.getElementById('boardList');
  boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시
  // 검색 결과를 반복하여 목록에 추가
  results.forEach((board, index) => {
    const count = board.count;
    const title = board.title;
    // const createdAt = board.createdAt;
    const boardSeq = board.boardSeq;
    const year = board.year;
    const month = board.month;
    const day = board.day;
    // 새로운 게시물 요소 생성
    const boardElement = document.createElement('div');
    boardElement.innerHTML = `
            <div class="num">${index + 1}</div>
            <div class="title">
                <a href="/board?boardSeq=${boardSeq}" class="view-link">${title}</a>
            </div>
            <div class="date">${year}/${month}/${day}</div>
            <div class="count">${count}</div>
        `;
    // 생성된 요소를 목록에 추가
    boardList.appendChild(boardElement);
  });
}
