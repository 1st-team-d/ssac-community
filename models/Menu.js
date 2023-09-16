const Menu = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    'menu',
    {
      menuSeq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '메뉴 시퀀스',
      },
      title: {
        type: DataTypes.STRING, // VARCHAR(255)
        allowNull: false,
        comment: '메뉴 제목',
      },
      description: {
        type: DataTypes.STRING, // VARCHAR(255)
        comment: '메뉴에 대한 설명',
      },
      path: {
        type: DataTypes.STRING, // VARCHAR(255)
        allowNull: false,
        comment: '메뉴 경로',
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '메뉴 우선 순위',
      },
      isUse: {
        type: DataTypes.CHAR,
        allowNull: false,
        defaultValue: 'Y',
        comment: '메뉴 사용 여부 (Y: 사용 / N: 미사용)',
      },
    },
    {
      tableName: 'menu',
      freezeTableName: true,
      timestamp: true,
    }
  );
  return model;
};

module.exports = Menu;
