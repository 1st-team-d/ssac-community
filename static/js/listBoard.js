// 페이지 번호 변경 및 화면 표시 게시물 변경 함수
async function changePageNum(pageDiv) {
  // 해당 페이지 번호 클릭 -> 클릭한 this 객체가 pageDiv
  const pageNum = pageDiv.textContent;
  const boardList = document.getElementById('boardList');

  boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

  // 해당 페이지에 해당하는 데이터 보내달라고 요청
  const res = await axios({
    url: `/board/list?pageNum=${pageNum}`,
    method: 'get',
  });
  console.log(res.data);
  // 서버에서 전송한 게시물 데이터
  let boards = res.data.data;


  if (boards) {
    boards.forEach((board) => {
      const count = board.count;
      const title = board.title;
      const content = board.content;
      const boardSeq = board.boardSeq;
      const year = board.year;
      const month = board.month;
      const day = board.day;

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board?boardSeq=${boardSeq}" class="view-link">
        <div class="card mb-3">
          <div class="card-body row">
            <div class="board_info text-start fw-bold col-6">
              ${title}
              <span class="badge bg-secondary"
                >${year + '.' + month + '.' + day}</span
              >
              <span class="badge bg-secondary">view ${count}</span>
            </div>

            <div class="content col-12 text-start text-wrap gy-3">
                ${content <= 180 ? content : content.slice(0, 179) + ' ...'}
            </div>
          </div>
        </div>
      </a>
      `;
      div.innerHTML = html;
      // 생성된 요소를 목록에 추가
      boardList.append(div);
    })
  } else {
    innerHTML = `<div class="col-12">게시글이 없습니다.</div>`;
  }
  newDiv.innerHTML = innerHTML;
  newDivs.append(newDiv);
  console.log(newDivs);
  document.querySelector('#boardList').innerHTML = newDivs.innerHTML;
  console.log(boardList);

  // boardList 업데이트 하기 위한 newDivs
  const newDivs = document.createElement('div'); // boardList에 바꿔줄 div 여러개 담고 있는

  // 하나하나의 게시글 정보를 담을 div
  const newDiv = document.createElement('div');
  newDiv.classList.add('row', 'py-2');
  let innerHTML = '';

  // 페이지 변경했을 때, 값이 있는 경우
  if (boards) {
    boards.forEach((board, index) => {
      const count = board.count;
      const title = board.title;
      const boardSeq = board.boardSeq;
      const year = board.year;
      const month = board.month;
      const day = board.day;

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      innerHTML = `
        <div class="num col-2">${(pageNum - 1) * 5 + 1 + index}</div>
        <div class="title col-6">
            <a href="/board?boardSeq=${boardSeq}" class="view-link">${title}</a>
        </div>
        <div class="date col-2">${year}/${month}/${day}</div>
        <div class="count col-2">${count}</div>
      `;
    });
    // 페이지 변경했을 때, 값이 없는 경우, '게시글이 없습니다.' 출력
  } else {
    innerHTML = `<div class="col-12">게시글이 없습니다.</div>`;
  }
  newDiv.innerHTML = innerHTML;
  newDivs.append(newDiv);
  console.log(newDivs);
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
  fetch(`/board/list?search=${sanitizedKeyword}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('검색 결과 데이터:', data);
      // 검색한 게시물 표시하는 함수
      renderSearchResults(data.data);
      // 검색어 있는 경우에 검색기능
      const boardPage = document.querySelector('#pagination');
      if (data.data.length) {
        // 페이징 처리
        let allSearchLen = data.data.length;
        console.log(allSearchLen, data.data);
        const newDivs = document.createElement('div');
        for (i = 0; i < Math.ceil(allSearchLen / 5); i++) {
          const newDiv = document.createElement('div');
          newDiv.setAttribute('onclick', 'changePageNum(this)');
          newDiv.textContent = `${i + 1}`;
          newDivs.append(newDiv);
        }
        boardPage.innerHTML = newDivs.innerHTML;
      } else {
        boardPage.innerHTML = '<div onclick="changePageNum(this)">1</div>';
      }
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
  console.log('검색 결과', results);
  const boardList = document.getElementById('boardList');
  boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

  // 검색 결과를 반복하여 목록에 추가
  if (results.length > 0) {
    results.forEach((board, index) => {
      const count = board.count;
      const title = board.title;
      const content = board.content;
      // const createdAt = board.createdAt;
      const boardSeq = board.boardSeq;
      const year = board.year;
      const month = board.month;
      const day = board.day;
      // 새로운 게시물 요소 생성
      const div = document.createElement('div');
      const html = `
      <a href="/board?boardSeq=${boardSeq}" class="view-link">
        <div class="card mb-3">
          <div class="card-body row">
            <div class="board_info text-start fw-bold col-6">
              ${title}
              <span class="badge bg-secondary"
                >${year + '.' + month + '.' + day}</span
              >
              <span class="badge bg-secondary">view ${count}</span>
            </div>

            <div class="content col-12 text-start text-wrap gy-3">
                ${content <= 180 ? content : content.slice(0, 179) + ' ...'}
            </div>
          </div>
        </div>
      </a>
      `;
      div.innerHTML = html;

      // 생성된 요소를 목록에 추가
      boardList.append(div);
    })
  } else {
    boardElement.innerHTML = `<div class="col-12">검색된 게시글이 없습니다.</div>`;
  }

  // 생성된 요소를 목록에 추가
  boardList.appendChild(boardElement);
}

// 모집글 카테고리 -> tagify
let input = document.querySelector('input[name="category"]'),
  // init Tagify script on the above inputs
  tagify = new Tagify(input, {
    enforceWhitelist: true,
    editTags: false,
    whitelist: ['웹', '앱', 'AI', 'UI / UX', '게임', '기타', '전체'],
    maxTags: 6,
    dropdown: {
      maxItems: 6, // <- mixumum allowed rendered suggestions
      classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
      enabled: 0, // <- show suggestions on focus
      closeOnSelect: false, // <- do not hide the suggestions dropdown once an item has been selected
    },
  });

// Chainable event listeners
tagify
  .on('add', onAddTag)
  .on('remove', onRemoveTag)
  .on('invalid', onInvalidTag)
  .on('focus', onTagifyFocusBlur)
  .on('blur', onTagifyFocusBlur)
  .on('dropdown:hide dropdown:show', (e) => console.log(e.type))
  .on('dropdown:select', onDropdownSelect);

var mockAjax = (function mockAjax() {
  var timeout;
  return function (duration) {
    clearTimeout(timeout); // abort last request
    return new Promise(function (resolve, reject) {
      timeout = setTimeout(resolve, duration || 700, whitelist);
    });
  };
})();

// tag added callback
async function onAddTag(e) {
  console.log('onAddTag: ', e.detail);
  console.log('original input value: ', input.value);
  // 선택된 카테고리
  const categories = tagify.value;
  // 요청을 위한 빈 배열
  const getCategories = [];
  // 태그 추가 이벤트 발생 전까지 있던 카테고리 배열에 추가
  categories.forEach((category) => {
    switch (category.value) {
      case '웹':
        getCategories.push(0);
        break;
      case '앱':
        getCategories.push(1);
        break;
      case 'AI':
        getCategories.push(2);
        break;
      case 'UI / UX':
        getCategories.push(3);
        break;
      case '게임':
        getCategories.push(4);
        break;
      case '기타':
        getCategories.push(5);
        break;
    }
  });
  console.log('카테고리>>>>', getCategories);
  tagify.off('add', onAddTag); // exmaple of removing a custom Tagify event
  // 카테고리 추가되었으므로 input의 모든 카테고리 값으로 조회
  const res = await axios({
    url: '/board/list',
    method: 'get',
    params: { category: getCategories },
  });
}

// tag removed callback
function onRemoveTag(e) {
  console.log('onRemoveTag:', e.detail, 'tagify instance value:', tagify.value);
  // 카테고리 삭제되었으므로 현재 input의 모든 카테고리 값으로 조회
  // 선택된 카테고리 파싱
  const categories = tagify.value;
  // 요청을 위한 빈 배열
  const getCategories = [];
  // 태그 추가 이벤트 발생 전까지 있던 카테고리 배열에 추가
  categories.forEach((category) => {
    switch (category.value) {
      case '웹':
        getCategories.push(0);
        break;
      case '앱':
        getCategories.push(1);
        break;
      case 'AI':
        getCategories.push(2);
        break;
      case 'UI / UX':
        getCategories.push(3);
        break;
      case '게임':
        getCategories.push(4);
        break;
      case '기타':
        getCategories.push(5);
        break;
    }
  });
  console.log('카테고리>>>>', getCategories);
  axios({
    url: '/board/list',
    method: 'get',
    params: { category: getCategories },
  });
}

// invalid tag added callback
function onInvalidTag(e) {
  console.log('onInvalidTag: ', e.detail);
}

function onTagifyFocusBlur(e) {
  console.log(e.type, 'event fired');
}

function onDropdownSelect(e) {
  console.log('onDropdownSelect: ', e.detail);

  const boardElement = document.createElement('div');
  boardElement.classList.add('row', 'py-2');

  // 검색 결과 있는 경우
  if (results.length > 0) {
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
      boardElement.innerHTML = `
          <div class="num col-2">${index + 1}</div>
          <div class="title col-6">
              <a href="/board/list?boardSeq=${boardSeq}" class="view-link">${title}</a>
          </div>
          <div class="date col-2">${year}/${month}/${day}</div>
          <div class="count col-2">${count}</div>
      `;
    });

  // 검색한 값이 없는 경우, '검색된 게시글이 없습니다.' 출력
  } else {
    boardElement.innerHTML = `<div class="col-12">검색된 게시글이 없습니다.</div>`;
  }

  // 생성된 요소를 목록에 추가
  boardList.appendChild(boardElement);
}
