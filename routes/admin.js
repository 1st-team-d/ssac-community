const express = require('express');
const router = express.Router();
const controller = require('../controller/Cadmin');

router.get('/', controller.getAdmin); // 관리자 메인 화면

router.get('/user', controller.getUser); // 모든 유저 조회
router.get('/user/board/:userSeq', controller.getUserBoard); // 게시글 조회
router.get('/user/comment/:userSeq', controller.getUserComment); // 댓글 조회
router.delete('/user/remove', controller.deleteUser); // 유저 삭제

// ################# 관리자 게시글 #################
router.get('/board', controller.getBoard); // 게시글 조회 화면
router.get('/board/list', controller.getBoardList); // 게시글 검색 + 모든 게시글 조회 가능(검색어 없이 입력 시)
router.get('/board/profile/:boardSeq', controller.getProfileBoard); // 특정 게시글 조회
router.patch('/board/modify/', controller.patchBoard); // (특정) 게시글 수정
router.delete('/board/remove/', controller.deleteBoard); // (특정) 게시글 삭제

// ################# 관리자 댓글 #################
router.get('/comment', controller.getComment); // 댓글 조회 화면
router.get('/comment/list', controller.getCommentList); // 댓글 검색 + 모든 댓글 조회 가능(검색어 없이 입력 시)
router.delete('/comment/remove', controller.deleteComment); // (특정) 댓글 삭제

// ################# 관리자 스터디 #################
router.get('/study', controller.getStudy); // 스터디 조회 화면
router.get('/study/list', controller.getStudyList); // 스터디 검색 + 모든 스터디 조회 가능(검색어 없이 입력 시)
router.get('/study/profile/:studySeq', controller.getProfileStudy); // 특정 스터디 조회

module.exports = router;
