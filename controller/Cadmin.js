// User 모델 모듈 불러오기
const { User, Board, Comment, Study, StudyApply, sequelize } = require('../models');
const Op = require('sequelize').Op;

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

// GET '/admin/study'
// 스터디 조회 화면
exports.getStudy = async (req, res) => {
  try {
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
      include: [{ model: Board }],
      order: [['createdAt', 'DESC']],
    });
    res.render('admin/study/listStudy', {
      studyInfo: studyInfo,
      allStudyLen: studyInfo.length,
    });
  } catch (err) {
    console.log(err);
  }
};

// GET '/admin/study/list?search=###'
// 모든 스터디 조회 + 스터디 검색
exports.getStudyList = async (req, res) => {
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

    res.send({
      studyInfo: studyInfo,
      allStudyLen: studyInfo.length,
      msg: 'success',
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
  }
};

// GET '/admin/study/profile/:studySeq'
// 특정 스터디 조회
exports.getProfileStudy = async (req, res) => {
  try {
    const { studySeq } = req.params;

    // 1) 스터디 & 게시물 정보
    const studyInfo = await Study.findOne({
      include: [{ model: Board }],
      where: {
        studySeq: studySeq,
      },
    });

    // 2) 스터디 참가자 정보
    const userInfo = await User.findAll({
      include: [
        {
          model: StudyApply,
          required: true, // true / false : inner join / outer join
          // right: true, // has no effect // right outer join
          include: [
            {
              model: Study,
              required: true, // true / false : inner join / outer join
              // right: true, // has no effect // right outer join
            },
          ],
          where: {
            studySeq: studySeq,
          },
        },
      ],
      attributes: [
        'id',
        'name',
        [sequelize.col('study_applies.createdAt'), 'study_apply_createdAt'],
        [sequelize.col('study_applies.updatedAt'), 'study_apply_updatedAt'],
        [
          sequelize.fn('YEAR', sequelize.col('study_applies.createdAt')),
          'year',
        ],
        [
          sequelize.fn('MONTH', sequelize.col('study_applies.createdAt')),
          'month',
        ],
        [sequelize.fn('DAY', sequelize.col('study_applies.createdAt')), 'day'],
      ],
      order: [['study_apply_createdAt', 'ASC']],
    });

    res.render('admin/study/viewStudy', {
      studyInfo: studyInfo,
      userInfo: userInfo,
      allUserLen: userInfo.length,
    });
  } catch (err) {
    console.log(err);
  }
};
