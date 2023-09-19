// User 모델 모듈 불러오기
const { User, Board, Study, sequelize } = require('../models');

// GET '/admin'
// 관리자 메인 화면
exports.getAdmin = (req, res) => {
  res.render('admin/index');
};

// 유저 관리 화면
exports.getUser = async (req, res) => {
  try {
    // 특정 유저의 유저 시퀀스
    const { userSeq } = req.query;

    // 특정 유저 화면
    if (userSeq) {
      const user = await User.findOne({
        where: { userSeq: userSeq },
        include: [
          {
            model: Board,
            attributes: [
              'boardSeq',
              'title',
              'content',
              'filePath',
              'count',
              [
                sequelize.fn('YEAR', sequelize.col('boards.createdAt')),
                'createdYear',
              ],
              [
                sequelize.fn('MONTH', sequelize.col('boards.createdAt')),
                'createdMonth',
              ],
              [
                sequelize.fn('DAY', sequelize.col('boards.createdAt')),
                'createdDay',
              ],
              'createdAt',
              [
                sequelize.fn('YEAR', sequelize.col('boards.updatedAt')),
                'updatedYear',
              ],
              [
                sequelize.fn('MONTH', sequelize.col('boards.updatedAt')),
                'updatedMonth',
              ],
              [
                sequelize.fn('DAY', sequelize.col('boards.updatedAt')),
                'updatedDay',
              ],
              'updatedAt',
            ],

            include: [{ model: Study }],
          },
        ],
      });

      // res.send({ user });
      res.render('admin/userInfo', { users: user });
    } else {
      // 전체 유저 조회
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
        include: [{ model: Board }],
      });

      res.render('admin/user', { users: user });
    }
  } catch (err) {
    console.error(err);
    res.send({ msg: false });
  }
};
