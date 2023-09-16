const Study = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    'study',
    {
      studySeq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '스터디 정보 시퀀스',
      },
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment:
          '스터디 카테고리 (0: Web, 1: App, 2: AI, 3: UI/UX, 4: 게임, 5: 기타)',
      },
      maxPeople: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '스터디 최대 (모집) 인원',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '스터디 모집 상태 (0: 모집중, 1: 모집마감)',
      },
    },
    {
      tableName: 'study',
      freezeTableName: true,
      timestamp: true,
    }
  );
  return model;
};

module.exports = Study;
