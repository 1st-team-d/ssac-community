// GET '/'
// 메인 화면
exports.index = (req, res) => {
  // console.log(req.session.userInfo);
  res.render("index", { session: req.session.userInfo });
};
