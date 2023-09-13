const { Board, Comment } = require("../models");

// 게시글 조회 화면
exports.getBoard = async (req, res) => {
  // Todo: 게시글 조회 화면 파일명 확인

  res.render("board/listBoard");
  // res.render("board/postBoard");
};

// 특정 게시글 화면
exports.getBoardId = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스
    const { boardSeq } = req.params;
    console.log(boardSeq);

    // DB 접근
    const board = await Board.findOne({
      where: { boardSeq: boardSeq },
    });

    // res.render("임시값", {
    //   isGetBoardId: true,
    //   title: board.title,
    //   content: board.content,
    //   imgPath: board.imgPath,
    //   count: board.count,
    //   msg: "특정 게시물 화면 띄우기 성공",
    // });
    res.send(board);
  } catch (err) {
    console.error(err);
    res.send({ isGetBoardId: false, msg: "특정 게시물 화면 띄우기 실패" });
  }
};

// 게시글 검색 -> 조회 - 진행 중
// exports.getSearch = async (req, res) => {
//   try {
//   } catch (err) {
//     console.error(err);
//     res.send({ isSearch: false });
//   }
// };

// 게시글 삭제 처리
exports.deleteBoard = async (req, res) => {
  try {
    // 특정 게시글의 게시글 시퀀스
    const { boardSeq } = req.body;

    // DB 접근
    const board = await Board.destroy({
      where: { boardSeq: boardSeq },
    });

    if (board) {
      res.send({ isDelete: true, msg: "게시물 삭제 성공" });
    } else {
      res.send({ isDelete: false, msg: "게시글 시퀀스 오류" });
    }
  } catch (err) {
    console.error(err);
    res.send({ isDelete: false, msg: "게시물 삭제 실패" });
  }
};

// GET '/board/register'
// 게시글 등록 화면으로 이동 // 수정 화면도 동일
exports.getRegister = (req, res) => {
  res.render("board/postBoard");
};

// POST '/board/register'
// 게시글 등록
exports.postRegister = async (req, res) => {
  try {
    // ############### 파일 업로드 문제 없는지 확인 ###############
    // console.log('req.file ::::: ', req.file); // single
    const { fieldname, destination, filename } = req.file;
    const imagePath = destination + filename;
    // console.log('req.files ::::: ', req.files); // fields, array
    // console.log('req.body ::::: ', req.body);

    const jsonData = JSON.parse(req.body["data"]); // 넘어온 JSON 데이터를 JS Object로 변환

    // console.log('jsonData ::::: ', jsonData);
    // req.file.preFilepath = '/uploadImage/'; // userUpload 설정
    const { title, content } = jsonData;

    // console.log('title ::::: ', title);
    // console.log('content ::::: ', content);
    // console.log('imagePath ::::: ', imagePath);

    // ############### DB 작업 ###############
    const insertOneBoard = await Board.create({
      title: title,
      content: content,
      imagePath: imagePath,
    });

    // console.log(insertOneBoard);

    // res.send({ file: req.file, data: req.body });
    res.send(insertOneBoard);
    // res.send('hello')
  } catch (err) {
    console.log(err);
  }
};

// GET '/board/modify'
// 게시글 수정 화면
exports.getModify = async (req, res) => {
  try {
    const { boardSeq } = req.body;
    const selectOneBoard = await Board.findOne({
      where: {
        boardSeq: boardSeq,
      },
    });

    res.render("board/postBoard", { result: selectOneBoard });
  } catch (err) {
    console.log(err);
  }
};

// PATCH '/board/modify'
// 게시글 수정 처리
exports.patchModify = async (req, res) => {
  try {
    // 이미지 업로드
    const { fieldname, destination, filename } = req.file;
    const imagePath = destination + filename;

    const jsonData = JSON.parse(req.body["data"]);
    const { title, content, boardSeq } = jsonData;

    // DB 작업
    const updateOneBoard = await Board.update(
      {
        title: title,
        content: content,
        imagePath: imagePath,
      },
      {
        where: {
          boardSeq: boardSeq,
        },
      }
    );

    res.send(updateOneBoard);
  } catch (err) {
    console.log(err);
  }
};
