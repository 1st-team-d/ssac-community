'use strict';

const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.js')['dev']; // 로컬 환경
// const config = require(__dirname + '/../config/config.js')['prod']; // 배포 환경
const db = {};

const { database, username, password } = config;
console.log(config);

const sequelize = new Sequelize(database, username, password, config); // db, user, password, config 객체 저장

// Sequelize 모델
const User = require('./User')(sequelize, Sequelize);
const Board = require('./Board')(sequelize, Sequelize);
const Comment = require('./Comment')(sequelize, Sequelize);

// 모델간 관계 설정
// 1) 유저 : 게시글 = 1 : N
User.hasMany(Board, {
  foreignKey: 'userSeq',
  sourceKey: 'userSeq',
  // 연쇄 수정 및 삭제 옵션 X
  // → 새싹을 졸업하거나 탈퇴해도 게시글이 남도록 설정
  // → 작성자가 없는 경우, '탈퇴한 사용자' 등으로 대체 해야함
  // onDelete: 'CASCADE',
  // onUpdate: 'CASCADE',
});
Board.belongsTo(User, { foreignKey: 'userSeq', targetKey: 'userSeq' });

// 2) 게시글 : 댓글 = 1 : N
Board.hasMany(Comment, {
  foreignKey: 'boardSeq',
  sourceKey: 'boardSeq',
  // 연쇄 수정 및 삭제 옵션 X
  // → 새싹을 졸업하거나 탈퇴해도 댓글이 남도록 설정
  // → 작성자가 없는 경우, '탈퇴한 사용자' 등으로 대체 해야함
  // onDelete: 'CASCADE',
  // onUpdate: 'CASCADE',
});
Comment.belongsTo(Board, { foreignKey: 'boardSeq', targetKey: 'boardSeq' }); // foreignKey: 실제 테이블에 작성할 컬럼명

db.User = User;
db.Board = Board;
db.Comment = Comment;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
