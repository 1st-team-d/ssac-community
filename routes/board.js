// '/board'로 오는 모든 요청은 여기서 처리
const express = require('express');
const controller = require('../controller/Cboard');
const router = express.Router();

const multer = require('multer');
const path = require('path');

// 업로드 이미지 설정
// const uploadConfig = multer({
//   storage: multer.diskStorage({
//     destination(req, file, callback) {
//       const date = new Date();
//       const year = date.getFullYear();
//       let month = date.getMonth() + 1;
//       let day = date.getDate();

//       // 월과 일이 2자리가 아닌 경우, 0을 붙여줌
//       if (month < 10) month = '0' + month;
//       if (day < 10) day = '0' + day;

//       //   console.log(month, day);

//       const folderName = `uploads/${year}${month}${day}/`;
//       callback(null, folderName); // 이미지 업로드 폴더 경로 설정
//     },
//     filename(req, file, callback) {
//       const random = Math.trunc(Math.random() * Math.pow(10, 8)); // 임의의 8자리 숫자를 가지고 온다.
//       console.log(random);
//       const ext = path.extname(file.originalname); // 확장자 추출
//       const fileName = path.basename(file.originalname, ext) + random + ext; // 파일명
//       // Ex) apple.png → apple40195724.png
//       callback(null, fileName); // 업로드할 이미지의 파일명 설정
//     },
//   }),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 파일 최대 사이즈 : 5MB
//   },
// });

const uploadDetail = multer({
    // storage: 저장할 공간에 대한 정보
    storage: multer.diskStorage({
      // done: callback(콜백함수)
      // done(null, xx) 여기서  null은 error를 의미하는 매개변수
      // 에러가 없으므로 "null"이라고 전달하여 콜백 함수를 호출!
      // done안의 첫번째 인수에는 에러가 있다면 에러를, 두번째 인수에는 실제 경로나, 파일이름을 넣는다.
      destination(req, file, done) {
        done(null, 'uploads/'); // 파일을 업로드할 경로 설정
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname); // 파일 "확장자"를 추출
        done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일 이름에 날짜추가하여 중복 방지
      },
    }),
    // limits: 파일 제한 정보
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB
  });
  

router.get('/', controller.board); // 게시글 목록 화면

router.get('/register', controller.getRegister); // 게시글 등록 화면
router.post(
  '/register',
  uploadDetail.single('uploadImage'),
  controller.postRegister
); // 게시글 등록

module.exports = router;
