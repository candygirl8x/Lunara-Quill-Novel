function verifyAuth(req, res, next) {
  req.user = { uid: 'guest_reader' };
  next();
}

module.exports = verifyAuth;
