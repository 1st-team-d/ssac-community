const User = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    'user',
    {
      userSeq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '유저 시퀀스'
      },
      id: {
        type: DataTypes.STRING, // VARCHAR(255)
        allowNull: false,
        comment: '유저 아이디',
      },
      pw: {
        type: DataTypes.STRING, // VARCHAR(255)
        allowNull: false,
        comment: '유저 비밀번호',
      },
      name: {
        type: DataTypes.STRING, // VARCHAR(255)
        allowNull: false,
        comment: '유저 이름(실명)',
      },
      isAdmin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '관리자 여부(0: 유저 / 1: 관리자)',
      },
    },
    {
      tableName: 'user',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return model;
};

module.exports = User;
