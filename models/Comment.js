const Comment = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    'comment',
    {
      commentSeq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '댓글 시퀀스',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '댓글 내용',
      },
    },
    {
      tableName: 'comment',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return model;
};

module.exports = Comment;
