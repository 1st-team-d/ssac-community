const itemsPerPage = 5; // 한 페이지에 표시할 게시물 수
// 페이지당 게시물 수와 현재 페이지 번호
let currentPage = 1; // 현재 페이지 번호
// 게시물을 동적으로 생성하고 표시하는 함수

// 페이지 번호 변경 및 화면 표시 게시물 변경 함수

async function changePageNum(pageDiv) {
  // 해당 페이지 번호 클릭 -> 클릭한 this 객체가 pageDiv
  const pageNum = pageDiv.textContent;

  // 해당 페이지에 해당하는 데이터 보내달라고 요청
  const res = await axios({
    url: `/board?pageNum=${pageNum}`,
    method: 'get',
  });
  console.log(res.data);
  // 서버에서 전송한 게시물 데이터
  let boards = res.data.data;

  // boardList 업데이트 하기 위한 newDivs
  const newDivs = document.createElement('div'); // boardList에 바꿔줄 div 여러개 담고 있는

  boards.forEach((board, index) => {
    const count = board.count;
    const title = board.title;
    const boardSeq = board.boardSeq;
    const year = board.year;
    const month = board.month;
    const day = board.day;

    const newDiv = document.createElement('div');
    // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
    newDiv.innerHTML = `
      <div class="num">${(pageNum - 1) * 5 + 1 + index}</div>
      <div class="title">
          <a href="/board?boardSeq=${boardSeq}" class="view-link">${title}</a>
      </div>
      <div class="date">${year}/${month}/${day}</div>
      <div class="count">${count}</div>`;
    newDivs.append(newDiv);
  });
  document.querySelector('#boardList').innerHTML = newDivs.innerHTML;
  // newDivs의 innerHTML 이 곧 num, title ~~ 이런거니까 이걸 계속 바꿔주면 됨.
}

// 검색 버튼 요소 가져오기
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

const performSearch = async () => {
  // 입력된 검색어 가져오기
  const keyword = searchInput.value; // "      "
  // 검색어가 비어있을 경우 null 또는 공백 문자열로 대체
  const sanitizedKeyword = keyword.trim(); // ""

  if (!sanitizedKeyword) {
    // !"" -> !false -> true
    return;
  }

  // 검색어를 서버로 전송하여 검색 요청 보내기
  fetch(`/board?search=${sanitizedKeyword}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('검색 결과 데이터:', data);
      renderSearchResults(data.data);
    })
    .catch((error) => {
      console.error('검색 오류:', error);
    });
};

// 검색 버튼 클릭 이벤트 리스너 추가
searchButton.addEventListener('click', performSearch);
// 검색 버튼 엔터 이벤트 리스너 추가
searchInput.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    performSearch();
  }
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
