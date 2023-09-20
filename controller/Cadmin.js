// User 모델 모듈 불러오기
const {
  User,
  Board,
  Comment,
  Study,
  StudyApply,
  sequelize,
} = require('../models');
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

// ################# 관리자 게시글 #################
// GET '/admin/board'
// 게시글 조회 화면
exports.getBoard = async (req, res) => {
  try {
    const boardInfo = await Board.findAll({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'board.createdAt',
        'user.userSeq',
        'user.id',
        'user.name',
        'user.isAdmin',
        'user.createdAt',
      ],
      include: [{ model: User }],
      order: [['createdAt', 'DESC']],
    });

    res.render('admin/board/listBoard', {
      boardInfo: boardInfo,
      allBoardLen: boardInfo.length,
    });
  } catch (err) {
    console.log(err);
  }
};

// GET '/admin/board/list?search=###'
// 게시글 검색 + 모든 게시글 조회 가능(검색어 없이 입력 시)
exports.getBoardList = async (req, res) => {
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

    const boardInfo = await Board.findAll({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'board.createdAt',
        'user.userSeq',
        'user.id',
        'user.name',
        'user.isAdmin',
        'user.createdAt',
      ],
      where: where,
      include: [{ model: User }],
      order: [['createdAt', 'DESC']],
    });

    res.send({
      boardInfo: boardInfo,
      allBoardLen: boardInfo.length,
      msg: 'success',
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
  }
};

// GET '/admin/board/profile/:boardSeq'
// 특정 게시글 조회
exports.getProfileBoard = async (req, res) => {
  try {
    const { boardSeq } = req.params;

    // 게시글 정보
    const boardInfo = await Board.findOne({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'board.createdAt',
        'user.userSeq',
        'user.id',
        'user.name',
        'user.isAdmin',
        'user.createdAt',
      ],
      include: [{ model: User }],
      where: {
        boardSeq: boardSeq,
      },
      order: [['createdAt', 'DESC']],
    });

    res.render('admin/board/viewBoard', {
      boardInfo: boardInfo,
      allBoardLen: boardInfo.length,
    });
  } catch (err) {
    console.log(err);
  }
};

// PATCH '/admin/board/modify'
// (특정) 게시글 수정
exports.patchBoard = async (req, res) => {
  try {
    const { title, content, boardSeq } = req.body;
    const updateOneBoard = await Board.update(
      {
        title: title,
        content: content,
      },
      {
        where: {
          boardSeq: boardSeq,
        },
      }
    );

    if (updateOneBoard) {
      res.send({ msg: 'success' });
    } else {
      res.send({ msg: 'fail' });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
  }
};

// DELETE '/admin/board/remove'
// 게시글 삭제
exports.deleteBoard = async (req, res) => {
  try {
    const { boardSeq } = req.body;
    const deleteOneBoard = await Board.destroy({
      where: {
        boardSeq: boardSeq,
      },
    });

    if (deleteOneBoard) {
      res.send({ msg: 'success' });
    } else {
      res.send({ msg: 'fail' });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
  }
};

// ################# 관리자 스터디 #################
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
// 스터디 검색 + 모든 스터디 조회 가능(검색어 없이 입력 시)
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
