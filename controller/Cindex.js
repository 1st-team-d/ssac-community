const { Board } = require('../models');

// GET '/'
// 메인 화면
exports.index = async (req, res) => {
  // console.log(req.session.userInfo);
  // 조회수가 높은 차례대로 글 5개 전달
  const rankBoard = await Board.findAll({
    order: [['count', 'DESC']],
    limit: 5,
  });
  // console.log('rank >>>>>', rankBoard);
  // rankBoard 사용 예시 : 게시글의 조회수 출력
  // for (i = 0; i < rankBoard.length; i++) {
  //   console.log('rankBoard.count = ', rankBoard[i].count);
  // }

  res.render('index', { session: req.session.userInfo, boards: rankBoard });
};
