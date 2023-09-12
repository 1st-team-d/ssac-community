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
      maxAge: 60 * 1000,
    },
  })
);

// '/' 요청
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
const boardRouter = require('./routes/board');
app.use('/board', boardRouter);
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// app.get('/board', (req, res) => {
//   res.render('board/listBoard');
// });

app.get('/board/viewBoard', (req, res) => {
  res.render('board/viewBoard', {
    // 임시 데이터
    data: {
      postTitle: '안녕하세요',
      postId: '3',
      userName: '홍길동',
      postDate: '2023.09.08',
      postCount: '33',
      postContent:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut orci accumsan urna tempus maximus ac at mi. Vestibulum sed consequat tortor. Pellentesque in egestas leo, id pharetra ligula. Mauris egestas, dui id laoreet consectetur, mi magna iaculis nunc, sed congue mi magna sit amet urna. Cras iaculis sed lectus non elementum. Cras tempus lacus in tellus gravida ullamcorper. Mauris mollis, sem vitae euismod vehicula, quam neque porttitor tellus, nec fringilla tellus lectus et dui. Cras ut laoreet arcu, vitae consequat augue. Mauris nec metus lacus. Ut semper nulla ut suscipit mollis.\nCurabitur venenatis lacus sed urna ultrices fringilla. Sed laoreet blandit iaculis. Vestibulum commodo augue aliquet odio interdum facilisis. Duis porttitor iaculis enim, a venenatis tortor feugiat sed. Nullam tortor risus, tincidunt consequat metus ut, vehicula finibus orci. Proin cursus metus sit amet elit suscipit ultricies. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec eget risus felis.',
      postFilePath: '/static/images/ssac-logo.png',
      postFileName: 'ssac-logo.png',
    },
    loginUserData: { userName: '김땡땡' },
  });
});

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
