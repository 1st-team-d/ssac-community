const express = require('express');
const app = express();

// .env 불러오기
const dotenv = require('dotenv');
dotenv.config();

// 서버 설정
const LOCAL_IP = process.env.LOCAL_IP;
const PORT = process.env.PORT;

// 미리 설정한 sequelize 불러오기
const db = require('./models/index');

// 세션
const session = require('express-session');

// 뷰 설정
app.set('view engine', 'ejs');
app.set('/views', 'views');

// static (css)
app.use('/static', express.static(__dirname + '/static'));
app.use('/uploadFile', express.static(__dirname + '/uploads'));

// 미들웨어 등록
// body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// express-session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    },
  })
);

// 쿠키
const cookieParser = require('cookie-parser');
const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;
app.use(cookieParser(COOKIE_SECRET_KEY)); // 암호화 쿠키

// '/' 요청
// 메인
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
// 게시글
const boardRouter = require('./routes/board');
app.use('/board', boardRouter);
// 댓글
const commentRouter = require('./routes/comment');
app.use('/comment', commentRouter);
// 유저
const userRouter = require('./routes/user');
app.use('/user', userRouter);
// 스터디
const studyRouter = require('./routes/study');
app.use('/study', studyRouter);
// 관리자
async function isAdmin(req, res, next) {
  if (req.session.userInfo.isAdmin) {
    return res.render('admin/index');
  } else {
    return res.render('error');
  }
}

const adminRouter = require('./routes/admin');
app.use('/admin', isAdmin, adminRouter);

// 에러 처리
app.get('*', (req, res) => {
  res.render('error');
});

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    // console.log('Database connection succeeded!');
    console.log(`http://${LOCAL_IP}:${PORT} is running !!`);
  });
});
