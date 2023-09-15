const StudyApply = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    'study_apply',
    {
      studyApplySeq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '스터디 신청현황 시퀀스',
      },
    },
    {
      tableName: 'study_apply',
      freezeTableName: true,
      timestamps: true,
    }
  );

  return model;
};

module.exports = StudyApply;
