// '/board'로 오는 모든 요청은 여기서 처리
const express = require('express');
const controller = require('../controller/Cboard');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 파일 업로드 잘되는지 확인
// const upload = multer({
//   dest: 'uploads/',
// });

// 업로드 이미지 설정
const uploadConfig = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      // 월과 일이 2자리가 아닌 경우, 0을 붙여줌
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;

      const isExist = fs.existsSync(`uploads/${year}${month}${day}`); // uploads/YYYYMMDD 폴더가 있는지 확인
      const folderName = path.join(`uploads/${year}${month}${day}`, '/'); // 폴더명은 'uploads/YYYYMMDD'의 형식

      if (!isExist) {
        // 만약 YYYYMMDD 폴더가 존재하지 않으면 폴더를 새로 생성
        fs.mkdirSync(folderName, { recursive: true });
      }

      callback(null, folderName); // 이미지 업로드 폴더 경로 설정
    },
    filename(req, file, callback) {
      const random = Math.trunc(Math.random() * Math.pow(10, 15)); // 임의의 15자리 숫자를 가지고 온다.
      //   console.log(random);
      const ext = path.extname(file.originalname); // 확장자 추출
      const fileName = path.basename(file.originalname, ext) + random + ext; // 파일명
      // Ex) apple.png → apple40195724.png
      callback(null, fileName); // 업로드할 이미지의 파일명 설정
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 파일 최대 사이즈 : 5MB
  },
});

router.get('/', controller.board); // 게시글 목록 화면
router.get('/register', controller.getRegister); // 게시글 등록 화면
router.post(
  '/register',
  uploadConfig.single('uploadImage'),
  controller.postRegister
); // 게시글 등록 처리
router.get('/modify', controller.getModify); // 게시글 수정 화면
router.patch(
  '/modify',
  uploadConfig.single('uploadImage'),
  controller.patchModify
); // 게시글 수정 처리

module.exports = router;
