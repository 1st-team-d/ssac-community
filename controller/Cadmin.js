// User 모델 모듈 불러오기
const { User, Board, Comment, Study, StudyApply } = require('../models');
const Op = require('sequelize').Op;

// GET '/admin'
// 관리자 메인 화면
exports.getAdmin = (req, res) => {
  res.render('admin/index');
};

exports.getUser = async (req, res) => {
  const user = await User.findAll();

  res.render('admin/user', { users: user });
};

// GET '/admin/study'
// 모든 스터디 조회
exports.getStudy = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          {
            title: { [Op.like]: `%${search}%` },
          },
          {
            content: { [Op.like]: `%${search}%` },
          },
        ],
      };
    }

    const studyInfo = await Study.findAll({
      attributes: [
        'studySeq',
        'category',
        'maxPeople',
        'status',
        'boardSeq',
        'board.title',
        'board.content',
        'board.filePath',
        'board.count',
        'board.userSeq',
      ],
      include: [
        {
          model: Board,
          where,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.send(studyInfo);
  } catch (err) {
    console.log(err);
  }
};
