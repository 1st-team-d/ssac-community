const { User, Board, Study, StudyApply } = require('../models');

// GET '/study/'
// 스터디 (관리) 화면으로 이동
exports.getStudy = async (req, res) => {
  try {
    // 스터디 모집 정보
    const recruitInfo = await Study.findAll({

    });

    // 스터디 참여 정보
    const applyInfo = await Study.findAll({
        
    });
  } catch (err) {}
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
