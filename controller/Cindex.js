const { Board, Study } = require('../models');
// GET '/'
// 메인 화면
exports.index = async (req, res) => {
  // 조회수가 높은 차례대로 글 6개까지 전달
  const MAIN_CARD_COUNT = 6;

  const rankBoard = await Board.findAll({
    order: [['count', 'DESC']],
    limit: MAIN_CARD_COUNT,
    include: [{ model: Study }],
  });
  const cookie = req.signedCookies.remain;

  res.render('index', {
    session: req.session.userInfo,
    boards: rankBoard,
    cookieEmail: cookie ? cookie.loginEmail : '',
    cookiePw: cookie ? cookie.loginPw : '',
  });
};
