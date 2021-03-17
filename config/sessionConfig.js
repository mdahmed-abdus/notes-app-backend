const { IN_PROD } = require('./appConfig');

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const { env } = process;

const { SESSION_SECRET = 'keep this secret', SESSION_NAME = 'user-sid' } = env;

const SESSION_IDLE_TIMEOUT = +(env.SESSION_IDLE_TIMEOUT || ONE_HOUR);
const SESSION_ABSOLUTE_TIMEOUT = +(env.SESSION_ABSOLUTE_TIMEOUT || ONE_DAY);

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
