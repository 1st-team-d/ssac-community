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
app.use('/uploadImage', express.static(__dirname + '/uploads'));


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
