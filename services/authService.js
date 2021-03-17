const { SESSION_NAME } = require('../config/sessionConfig');

const isLoggedIn = req => !!req.session.userId;

const login = (req, userId) => {
  req.session.userId = userId;
  req.session.createdAt = Date.now();
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      throw new Error('User could not be logged out');
    }

    res.clearCookie(SESSION_NAME);
    res.json({ success: true, message: 'User logged out' });
  });
};

module.exports = { isLoggedIn, login, logout };
