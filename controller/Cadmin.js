// User 모델 모듈 불러오기
const { User } = require('../models');

// GET '/admin'
// 관리자 메인 화면
exports.getAdmin = (req, res) => {
  res.render('admin/index');
};

exports.getUser = async (req, res) => {
  const user = await User.findAll();

  res.render('admin/user', { users: user });
};
