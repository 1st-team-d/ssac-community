const Board = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    'board',
    {
      boardSeq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '게시글 시퀀스',
      },
      title: {
        type: DataTypes.STRING, // VARCHAR(255)
        allowNull: false,
        comment: '게시글 제목',
      },
      content: {
        type: DataTypes.TEXT,
        comment: '게시글 내용',
      },
      imagePath: {
        type: DataTypes.STRING, // VARCHAR(255)
        comment: '게시글 첨부 이미지 경로',
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'board',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return model;
};

module.exports = Board;
