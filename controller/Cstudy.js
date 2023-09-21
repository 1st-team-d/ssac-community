const { User, Board, Study, StudyApply, sequelize } = require('../models');
const Op = require('sequelize').Op;

// GET '/study/'
// 스터디 (관리) 화면으로 이동
exports.getStudy = async (req, res) => {
  try {
    // 1) 모집하는 스터디 글 + 스터디 정보
    const recruitBoardInfo = await Board.findAll({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'createdAt',
        'updatedAt',
        'study.category',
        'study.maxPeople',
        'study.status',
      ],
      include: [
        {
          model: Study,
          required: true, // true / false : inner join / outer join
          // right: true, // has no effect // right outer join
        },
      ],
      where: {
        userSeq: req.session.userInfo.userSeq,
      },
      order: [['study', 'status', 'DESC']],
    });

    // console.log('######## recruitBoardInfo #########');
    // console.log(recruitBoardInfo);
    // console.log(recruitBoardInfo.title);
    // console.log(recruitBoardInfo.dataValues);
    // console.log(recruitBoardInfo[0].dataValues.year);
    // console.log(recruitBoardInfo[0].dataValues.study);

    // 2) 참여하는 스터디 글 + 스터디 정보
    const applyBoardInfo = await Board.findAll({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        'userSeq',
        'study.studySeq',
        'study.category',
        'study.maxPeople',
        'study.status',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'board.createdAt',
        'board.updatedAt',
      ],
      include: [
        {
          model: Study,
          required: true, // true / false : inner join / outer join
          // right: true, // has no effect // right outer join
          include: [
            {
              model: StudyApply,
              required: true, // true / false : inner join / outer join
              // right: true, // has no effect // right outer join
              where: {
                userSeq: req.session.userInfo.userSeq,
              },
            },
          ],
        },
      ],
      where: {
        userSeq: { [Op.ne]: req.session.userInfo.userSeq },
      },
      order: [['study', 'status', 'DESC']],
    });
    const cookie = req.signedCookies.remain;

    // console.log('######## applyBoardInfo #########');
    // console.log(applyBoardInfo);
    // console.log(applyBoardInfo[0]);
    // console.log(applyBoardInfo[0].dataValues.title);
    // console.log(applyBoardInfo[0].dataValues.year);
    // console.log(applyBoardInfo[0].dataValues.study);
    // console.log(applyBoardInfo[0].dataValues.study.studySeq);

    // res.render('study/listStudy', {
    //   recruitBoardInfo: recruitBoardInfo,
    //   applyBoardInfo: applyBoardInfo,
    // });

    res.render('study/listStudy', {
      recruitBoardInfo: recruitBoardInfo,
      applyBoardInfo: applyBoardInfo,
      session: req.session.userInfo,
      cookieEmail: cookie ? cookie.loginEmail : '',
      cookiePw: cookie ? cookie.loginPw : '',
      msg: 'success',
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
  }
};

// GET '/study/profile/:studySeq'
// 스터디 세부 정보
exports.getStudyProfile = async (req, res) => {
  try {
    // 1) 스터디 정보 및 스터디 참여자 정보
    const { studySeq } = req.params;
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
      order: [['study_apply_createdAt', 'ASC']], // 자동으로 복수형으로 설정됨
      // 참고 자료 : index.js에서 모델간 관계를 바꾸면 되긴한다는데.. 막는 법을 모르겠음
      // https://stackoverflow.com/questions/50571647/why-does-sequelize-pluralize-singularize-names-of-anything-all-and-how-to-sto
    });

    // console.log('######## userInfo #########');
    // console.log(userInfo);
    // console.log(userInfo[0]);
    // console.log(userInfo[0].id);
    // console.log(userInfo[0].name);
    // console.log(userInfo[0].dataValues.year);

    // 2) 스터디에 대한 게시글 정보 + 스터디 정보
    const studyInfo = await Board.findOne({
      attributes: [
        'boardSeq',
        'title',
        'content',
        'filePath',
        'count',
        'userSeq',
        [sequelize.fn('YEAR', sequelize.col('board.createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('board.createdAt')), 'month'],
        [sequelize.fn('DAY', sequelize.col('board.createdAt')), 'day'],
        'study.category',
        'study.maxPeople',
        'study.status',
      ],
      include: [
        {
          model: Study,
          required: true, // true / false : inner join / outer join
          // right: true, // has no effect // right outer join
          where: {
            studySeq: studySeq,
          },
        },
      ],
    });

    // console.log('######## studyInfo #########');
    // console.log(studyInfo);

    const cookie = req.signedCookies.remain;

    if (userInfo && studyInfo) {
      res.render('study/detailStudy', {
        userInfo: userInfo,
        studyInfo: studyInfo,
        session: req.session.userInfo,
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
        msg: 'success',
      });
    } else {
      res.render('error', { msg: 'fail' });
    }
  } catch (err) {
    console.log(err);
    res.render('error', { msg: 'fail' });
  }
};

// PATCH '/study/apply'
// 스터디 신청 처리
exports.patchStudyApply = async (req, res) => {
  try {
    const { studySeq, userSeq } = req.body;
    // console.log('req.body-----------------------------', req.body);
    const checkUser = await StudyApply.findOne({
      where: {
        userSeq: userSeq,
      },
    });

    if (checkUser) {
      res.send({ msg: 'alreadyStudy' });
    } else {
      // 신청을 했을때
      const studyApplyCount = await StudyApply.findAll({
        where: {
          studySeq: studySeq,
        },
        include: [{ model: Study }],
      });
      const studyInfo = await Study.findOne({
        attributes: ['studySeq', 'maxPeople', 'status'],
        where: {
          studySeq: studySeq,
        },
      });

      if (studyInfo.status == 0) {
        if (studyApplyCount.length < studyInfo.maxPeople) {
          //인원 추가
          const insertOneStudyApply = await StudyApply.create({
            studySeq: studySeq,
            userSeq: req.session.userInfo.userSeq,
          });
          const currentLength = studyApplyCount.length + 1;
          if (currentLength >= studyInfo.maxPeople) {
            // 모집 마감처리를 한다.
            const updateOneStudy = await Study.update(
              {
                status: 1, // 모집 마감으로 수정
              },
              {
                where: {
                  studySeq: studyInfo.studySeq,
                },
              }
            );
          }
          const cookie = req.signedCookies.remain;

          if (insertOneStudyApply) {
            res.send({
              cookieEmail: cookie ? cookie.loginEmail : '',
              cookiePw: cookie ? cookie.loginPw : '',
              msg: 'success',
            });
            // res.redirect('/board?boardSeq=54')
          } else {
            res.send({ msg: 'fail' });
          }
        } else {
          // 인원이 최대인원을 초과한 상황
          res.send({ msg: 'closedStudy' });
        }
      } else {
        res.send({ msg: 'closedStudy' });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
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

    const cookie = req.signedCookies.remain;

    if (updateOneStudy) {
      res.send({
        cookieEmail: cookie ? cookie.loginEmail : '',
        cookiePw: cookie ? cookie.loginPw : '',
        msg: 'success',
      });
    } else {
      res.send({ msg: 'fail' });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: 'fail' });
  }
};
