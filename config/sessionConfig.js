const { IN_PROD } = require('./appConfig');
const { env } = process;

const { SESSION_SECRET, SESSION_NAME } = env;
const SESSION_IDLE_TIMEOUT = +env.SESSION_IDLE_TIMEOUT;
const SESSION_ABSOLUTE_TIMEOUT = +env.SESSION_ABSOLUTE_TIMEOUT;

const SESSION_OPTIONS = {
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  proxy: true,
  cookie: {
    maxAge: SESSION_IDLE_TIMEOUT,
    secure: IN_PROD,
    sameSite: 'lax',
    httpOnly: true,
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
