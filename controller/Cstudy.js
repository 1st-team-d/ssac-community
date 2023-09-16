const { User, Board, Study, StudyApply, sequelize } = require('../models');
const Op = require('sequelize').Op;

// GET '/study/'
// 스터디 (관리) 화면으로 이동
exports.getStudy = async (req, res) => {
  try {
    // 1) 모집하는 스터디 글 + 스터디 정보
    const recruitBoardInfo = await Board.findAll({
      include: [{ model: Study }],
      where: {
        userSeq: req.session.userInfo.userSeq,
      },
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('year', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('month', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('day', sequelize.col('board.createdAt')), 'day'],
        'createdAt',
        'updatedAt',
        'study.category',
        'study.maxPeople',
        'study.status',
      ],
    });

    // console.log('######## recruitBoardInfo #########');
    // console.log(recruitBoardInfo);
    // console.log(recruitBoardInfo.title);
    // console.log(recruitBoardInfo.dataValues);
    // console.log(recruitBoardInfo[0].dataValues.year);
    // console.log(recruitBoardInfo[0].dataValues.study);

    // 2) 참여하는 스터디 글 + 스터디 정보
    const applyBoardInfo = await StudyApply.findAll({
      where: {
        userSeq: req.session.userInfo.userSeq,
      },
      include: [
        {
          model: Study,
          include: [
            {
              model: Board,
            },
          ],
        },
      ],
      attributes: [
        'study.studySeq',
        'study.category',
        'study.maxPeople',
        'study.status',
        'study.board.boardSeq',
        'study.board.title',
        'study.board.content',
        'study.board.filePath',
        'study.board.count',
        'study.board.userSeq',
        [sequelize.fn('year', sequelize.col('study.board.createdAt')), 'year'],
        [
          sequelize.fn('MONTH', sequelize.col('study.board.createdAt')),
          'month',
        ],
        [sequelize.fn('DAY', sequelize.col('study.board.createdAt')), 'day'],
        'study.board.createdAt',
        'study.board.updatedAt',
      ],
    });

    // console.log('######## applyBoardInfo #########');
    // console.log(applyBoardInfo);
    // console.log(applyBoardInfo[0]);
    // console.log(applyBoardInfo[0].dataValues.year);
    // console.log(applyBoardInfo[0].dataValues.study.studySeq);
    // console.log(applyBoardInfo[0].dataValues.study.board);
    // console.log(applyBoardInfo[0].dataValues.study.board.title);

    // res.render('study/listStudy', {
    //   recruitBoardInfo: recruitBoardInfo,
    //   applyBoardInfo: applyBoardInfo,
    // });
    res.render('study', {
      recruitBoardInfo: recruitBoardInfo,
      applyBoardInfo: applyBoardInfo,
    });
  } catch (err) {
    console.log(err);
  }
};

// PATCH '/study/apply'
// 스터디 신청 처리
exports.patchStudyApply = async (req, res) => {
  try {
    const { studySeq } = req.body;
    const insertOneStudyApply = await StudyApply.create({
      studySeq: studySeq,
      userSeq: req.session.userInfo.userSeq,
    });

    if (insertOneStudyApply) {
      res.send({ msg: 'success' });
    } else {
      res.send({ msg: 'fail' });
    }
  } catch (err) {
    console.log(err);
  }
};

// PATCH '/study/apply'
// 스터디 마감 처리
exports.patchStudyClose = async (req, res) => {
  try {
    const { studySeq } = req.body;
    const updateOneStudy = await Study.update(
      {
        status: 1, // 모집 마감으로 수정
      },
      {
        where: {
          studySeq: studySeq,
        },
      }
    );

    if (updateOneStudy) {
      res.send({ msg: 'success' });
    } else {
      res.send({ msg: 'fail' });
    }
  } catch (err) {
    console.log(err);
  }
};
