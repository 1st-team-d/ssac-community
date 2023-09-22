// 요소 추가하는 함수 반복돼서 분리
function updateElement(boards) {
  const boardList = document.getElementById('boardList');

  boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

  if (boards) {
    boards.forEach((board) => {
      const count = board.count;
      const title = board.title;
      const content =
        board.content.length <= 180
          ? board.content
          : board.content.slice(0, 179) + '...';
      const boardSeq = board.boardSeq;
      const year = board.year;
      const month = board.month;
      const day = board.day;

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
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
                ${content}
            </div>
          </div>
        </div>
      </a>
      `;
      div.innerHTML = html;
      // 생성된 요소를 목록에 추가
      boardList.append(div);
    });
  } else {
    innerHTML = `<div class="col-12">게시글이 없습니다.</div>`;
  }
}

// 페이지 번호 변경 및 화면 표시 게시물 변경 함수
async function changePageNum(pageDiv) {
  // 해당 페이지 번호 클릭 -> 클릭한 this 객체가 pageDiv
  const pageNum = pageDiv.textContent;

  // 해당 페이지에 해당하는 데이터 보내달라고 요청
  const res = await axios({
    url: `/board/list?pageNum=${pageNum}`,
    method: 'get',
  });
  let boards = res.data.data;
  updateElement(boards);
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
    document.location.reload();
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
        for (i = 0; i < Math.ceil(allSearchLen / 10); i++) {
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
      const content =
        board.content.length <= 180
          ? board.content
          : board.content.slice(0, 179) + '...';
      // const createdAt = board.createdAt;
      const boardSeq = board.boardSeq;
      const year = board.year;
      const month = board.month;
      const day = board.day;
      // 새로운 게시물 요소 생성
      const div = document.createElement('div');
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
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
                ${content}
            </div>
          </div>
        </div>
      </a>
      `;
      div.innerHTML = html;

      // 생성된 요소를 목록에 추가
      boardList.append(div);
    });
  } else {
    boardList.innerHTML = `<div class="col-12">검색된 게시글이 없습니다.</div>`;
  }
}

// 모집글 카테고리 -> tagify
let input = document.querySelector('input[name="category"]'),
  // init Tagify script on the above inputs
  tagify = new Tagify(input, {
    enforceWhitelist: true,
    editTags: false,
    whitelist: ['웹', '앱', 'AI', 'UI / UX', '게임', '기타'],
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
  if (res.data.board) {
    const boards = res.data.board;
    const boardList = document.getElementById('boardList');

    boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

    boards.forEach((board) => {
      const count = board.board.count;
      const title = board.board.title;
      const content =
        board.board.content.length <= 180
          ? board.board.content
          : board.board.content.slice(0, 179) + '...';
      const boardSeq = board.board.boardSeq;
      const year = board.board.year;
      const month = board.board.month;
      const day = board.board.day;
      const boardLength = boards.length;

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
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
                ${content}
            </div>
          </div>
        </div>
      </a>
      `;
      div.innerHTML = html;
      // 생성된 요소를 목록에 추가
      boardList.append(div);
      // 페이징 처리
      // 페이징 처리
      const boardPage = document.querySelector('.board_page');
      boardPage.innerHTML = '';
      const newDiv = document.createElement('div');
      for (i = 0; i < Math.ceil(boardLength / 10); i++) {
        const pageDiv = document.createElement('div');
        pageDiv.setAttribute('onclick', 'changePageNum(this)');
        pageDiv.textContent = i + 1;
        newDiv.append(pageDiv);
      }
      console.log('뉴디브', newDiv);
      boardPage.innerHTML = newDiv.innerHTML;
    });
  } else {
    const boardList = document.getElementById('boardList');
    const html = `<div class="col-12">게시글이 없습니다.</div>`;
    boardList.innerHTML = html;
  }
}

// tag removed callback
async function onRemoveTag(e) {
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
  const res = await axios({
    url: '/board/list',
    method: 'get',
    params: { category: getCategories },
  });
  console.log(res.data);
  if (res.data.board) {
    const boards = res.data.board;
    const boardList = document.getElementById('boardList');

    boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

    boards.forEach((board) => {
      const count = board.board.count;
      const title = board.board.title;
      const content =
        board.board.content.length <= 180
          ? board.board.content
          : board.board.content.slice(0, 179) + '...';
      const boardSeq = board.board.boardSeq;
      const year = board.board.year;
      const month = board.board.month;
      const day = board.board.day;
      const boardLength = boards.length;

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
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
                ${content}
            </div>
          </div>
        </div>
      </a>
      `;
      div.innerHTML = html;
      // 생성된 요소를 목록에 추가
      boardList.append(div);
      // 페이징 처리
      const boardPage = document.querySelector('.board_page');
      boardPage.innerHTML = '';
      const newDiv = document.createElement('div');
      for (i = 0; i < Math.ceil(boardLength / 10); i++) {
        const pageDiv = document.createElement('div');
        pageDiv.setAttribute('onclick', 'changePageNum(this)');
        pageDiv.textContent = i + 1;
        newDiv.append(pageDiv);
      }
      console.log('뉴디브', newDiv);
      boardPage.innerHTML = newDiv.innerHTML;
    });
  } else {
    const boards = res.data.data;
    const boardList = document.getElementById('boardList');

    boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

    const boardLength = res.data.allBoardLen;

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
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
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
      // 페이징 처리
      const boardPage = document.querySelector('.board_page');
      boardPage.innerHTML = '';
      const newDiv = document.createElement('div');
      for (i = 0; i < Math.ceil(boardLength / 10); i++) {
        const pageDiv = document.createElement('div');
        pageDiv.setAttribute('onclick', 'changePageNum(this)');
        pageDiv.textContent = i + 1;
        newDiv.append(pageDiv);
      }
      console.log('뉴디브', newDiv);
      boardPage.innerHTML = newDiv.innerHTML;
    });
  }
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
}
