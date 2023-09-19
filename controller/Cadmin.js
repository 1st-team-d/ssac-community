// User 모델 모듈 불러오기
const { User, sequelize } = require('../models');

// GET '/admin'
// 관리자 메인 화면
exports.getAdmin = (req, res) => {
  res.render('admin/index');
};

exports.getUser = async (req, res) => {
  const user = await User.findAll({
    attributes: [
      'userSeq',
      'id',
      'name',
      'isAdmin',
      [sequelize.fn('YEAR', sequelize.col('user.createdAt')), 'year'],
      [sequelize.fn('MONTH', sequelize.col('user.createdAt')), 'month'],
      [sequelize.fn('DAY', sequelize.col('user.createdAt')), 'day'],
      'createdAt',
      'updatedAt',
    ],
  });

  res.render('admin/user', { users: user });
};
