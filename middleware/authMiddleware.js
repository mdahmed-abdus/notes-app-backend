const { Unauthorized } = require('../errors/customErrors');
const { isLoggedIn, logout } = require('../services/authService');

const guest = (req, res, next) => {
  if (isLoggedIn(req)) {
    throw new Unauthorized();
  }

  next();
};

const auth = (req, res, next) => {
  if (!isLoggedIn(req)) {
    throw new Unauthorized();
  }

  next();
};

const active = (req, res, next) => {
  const now = Date.now();
  const { createdAt } = req.session;

  if (now > createdAt) {
    return logout(req, res);
  }

  next();
};

module.exports = { guest, auth, active };
