// GET '/admin'
// 관리자 메인 화면
exports.getAdmin = (req, res) => {
  res.render('admin/index');
};

exports.getUser = (req, res) => {
  res.render('admin/user');
};
