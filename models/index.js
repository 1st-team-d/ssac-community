'use strict';

const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.js')['dev']; // 로컬 환경
const db = {};

const { database, username, password } = config;
// console.log(config);

const sequelize = new Sequelize(database, username, password, config); // db, user, password, config 객체 저장

// Sequelize 모델
const User = require('./User')(sequelize, Sequelize);
const Board = require('./Board')(sequelize, Sequelize);
const Comment = require('./Comment')(sequelize, Sequelize);
const Study = require('./Study')(sequelize, Sequelize);
const StudyApply = require('./StudyApply')(sequelize, Sequelize);

// 모델간 관계 설정
// 1) 유저 : 게시글 = 1 : N
User.hasMany(Board, {
  foreignKey: 'userSeq',
  sourceKey: 'userSeq',
  // 연쇄 삭제 옵션 X
  // → 새싹을 졸업하거나 탈퇴해도 게시글이 남도록 설정
  // → 작성자가 없는 경우, '탈퇴한 사용자' 등으로 대체 해야함
  // onDelete: 'CASCADE',

  // 연쇄 수정 옵션 O
  // userSeq가 수정되면 게시글도 수정되어야 하지만.. userSeq가 수정될 일이 없는 것 같아 의미가 있는지는 모르겠음
  onUpdate: 'CASCADE',
});
Board.belongsTo(User, {
  foreignKey: { name: 'userSeq', allowNull: false },
  targetKey: 'userSeq',
});

// 2) 게시글 : 댓글 = 1 : N
Board.hasMany(Comment, {
  foreignKey: 'boardSeq',
  sourceKey: 'boardSeq',
  // 게시글이 삭제되면 모든 댓글 삭제
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Comment.belongsTo(Board, {
  foreignKey: { name: 'boardSeq' },
  targetKey: 'boardSeq',
}); // foreignKey: 실제 테이블에 작성할 컬럼명

// 3) 게시글 : 스터디 정보 = 1 : 1
Board.hasOne(Study, {
  foreignKey: 'boardSeq',
  sourceKey: 'boardSeq',
  // 게시글이 삭제되면 스터디 정보도 같이 모두 삭제 및 수정
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Study.belongsTo(Board, {
  foreignKey: { name: 'boardSeq' },
  targetKey: 'boardSeq',
});

// 4) 스터디 정보 : 스터디 신청현황 = 1 : 1 or M
Study.hasMany(StudyApply, {
  foreignKey: 'studySeq',
  sourceKey: 'studySeq',
  // 스터디 정보가 삭제되면 스터디 신청현황도 모두 삭제 및 수정
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
StudyApply.belongsTo(Study, {
  foreignKey: { name: 'studySeq' },
  targetKey: 'studySeq',
});

// 5) 유저 : 스터디 신청현황 = 1 : 0 or 1 or M
User.hasMany(StudyApply, {
  foreignKey: 'userSeq',
  sourceKey: 'userSeq',
  // 유저가 삭제되면 스터디 신청현황도 모두 삭제 및 수정
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
StudyApply.belongsTo(User, {
  foreignKey: { name: 'userSeq' },
  targetKey: 'userSeq',
});

// 6) 유저 : 댓글 = 1 : 0 or 1 or M
User.hasMany(Comment, {
  foreignKey: 'userSeq',
  sourceKey: 'userSeq',
  // 유저가 삭제되면 댓글도 모두 삭제 및 수정
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: { name: 'userSeq' },
  targetKey: 'userSeq',
});

db.User = User;
db.Board = Board;
db.Comment = Comment;
db.Study = Study;
db.StudyApply = StudyApply;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
