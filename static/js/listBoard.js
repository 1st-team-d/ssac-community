// 요소 추가하는 함수 반복돼서 분리 -> boards 배열 안에 요소에 대한 정보가 있을 때만 사용 가능.
// boards 배열 안에 객체로 한번 더 쌓여 있으면 한번 더 접근하는 과정이 필요해서 용이하지 않음
function updateElement(boards) {
  const boardList = document.getElementById('boardList');

  boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

  if (boards) {
    // 게시글이 있을 때
    console.log(boards);
    boards.forEach((board) => {
      const count = board.count || board.board.count;
      const title = board.title || board.board.title;
      let content;
      if (board.board) {
        content =
          board.board.content.length <= 180
            ? board.board.content
            : board.board.content.slice(0, 179) + '...';
      } else {
        content =
          board.content.length <= 180
            ? board.content
            : board.content.slice(0, 179) + '...';
      }
      const boardSeq = board.boardSeq || board.board.boardSeq;
      const year = board.year || board.board.year;
      const month = board.month || board.board.month;
      const day = board.day || board.board.day;
      const study = board.study?.category || board.category;
      let studyString;
      switch (study) {
        case 0:
          studyString = '웹';
          break;
        case 1:
          studyString = '앱';
          break;
        case 2:
          studyString = 'AI';
          break;
        case 3:
          studyString = 'UI/UX';
          break;
        case 4:
          studyString = '게임';
          break;
        default:
          studyString = '기타';
          break;
      }

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
        <div class="card mb-3">
          <div class="card-body row">
            <div class="board_info text-start fw-bold col-6">
              <span class="badge bg-primary">${studyString}</span>
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
    // 게시글이 없을 때
    const boardList = document.getElementById('boardList');
    const html = `<div class="col-12">게시글이 없습니다.</div>`;
    boardList.innerHTML = html;
    console.log('하이하이');
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
  console.log(boards);
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
  const boardList = document.getElementById('boardList');
  boardList.innerHTML = ''; // 기존 목록을 비우고 검색 결과를 새로 표시

  // 검색 결과를 반복하여 목록에 추가
  if (results.length > 0) {
    updateElement(results);
  }
}

// 모집글 목록에서 카테고리 별로 게시물 표시 -> tagify 라이브러리 활용
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

// tagify 어떤 이벤트 추가할건지
tagify
  .on('add', onAddTag)
  .on('remove', onRemoveTag)
  .on('invalid', onInvalidTag)
  .on('focus', onTagifyFocusBlur)
  .on('blur', onTagifyFocusBlur)
  .on('dropdown:hide dropdown:show')
  .on('dropdown:select', onDropdownSelect);

// 각 이벤트 발생 시 실행할 함수
async function onAddTag() {
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
  // 카테고리 추가되었으므로 input의 모든 카테고리 값으로 조회
  const res = await axios({
    url: '/board/list',
    method: 'get',
    params: { category: getCategories },
  });
  if (res.data.board) {
    updateElement(res.data.board);
  }
  // 페이징 처리
  const boardPage = document.querySelector('.board_page');
  boardPage.innerHTML = '';
  const newDiv = document.createElement('div');
  for (i = 0; i < Math.ceil(res.data.board.length / 10); i++) {
    const pageDiv = document.createElement('div');
    pageDiv.setAttribute('onclick', 'changePageNum(this)');
    pageDiv.textContent = i + 1;
    newDiv.append(pageDiv);
  }
  boardPage.innerHTML = newDiv.innerHTML;
}

// tag removed callback
async function onRemoveTag() {
  // 카테고리 삭제되었으므로 현재 input의 모든 카테고리 값으로 조회
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
      console.log(board);
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
      const study = board.category;
      let studyString;
      switch (study) {
        case 0:
          studyString = '웹';
          break;
        case 1:
          studyString = '앱';
          break;
        case 2:
          studyString = 'AI';
          break;
        case 3:
          studyString = 'UI/UX';
          break;
        case 4:
          studyString = '게임';
          break;
        default:
          studyString = '기타';
          break;
      }

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
        <div class="card mb-3">
          <div class="card-body row">
            <div class="board_info text-start fw-bold col-6">
              <span class="badge bg-primary">${studyString}</span>
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
      boardPage.innerHTML = newDiv.innerHTML;
    });
  } else {
    // 카테고리 선택된게 없으면 전체 게시물 조회
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
      const study = board.category || board.board.category;
      let studyString;
      switch (study) {
        case 0:
          studyString = '웹';
          break;
        case 1:
          studyString = '앱';
          break;
        case 2:
          studyString = 'AI';
          break;
        case 3:
          studyString = 'UI/UX';
          break;
        case 4:
          studyString = '게임';
          break;
        default:
          studyString = '기타';
          break;
      }

      const div = document.createElement('div');

      // innerHTML로 아예 갈아 엎어서 페이지 누를때마다 새로 집어넣기
      const html = `
      <a href="/board/list?boardSeq=${boardSeq}" class="view-link">
        <div class="card mb-3">
          <div class="card-body row">
            <div class="board_info text-start fw-bold col-6">
              <span class="badge bg-primary">${studyString}</span>
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
