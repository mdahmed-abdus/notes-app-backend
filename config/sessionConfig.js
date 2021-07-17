const { IN_PROD } = require('./appConfig');

const {
  SESSION_SECRET,
  SESSION_NAME,
  SESSION_IDLE_TIMEOUT,
  SESSION_ABSOLUTE_TIMEOUT,
} = process.env;

const SESSION_OPTIONS = {
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: SESSION_IDLE_TIMEOUT,
    secure: IN_PROD,
    sameSite: true,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
};

module.exports = {
  SESSION_NAME,
  SESSION_IDLE_TIMEOUT,
  SESSION_ABSOLUTE_TIMEOUT,
  SESSION_OPTIONS,
};
