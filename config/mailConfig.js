const { APP_HOSTNAME, IN_PROD } = require('./appConfig');
const { env } = process;

const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD } = env;
const SMTP_PORT = +env.SMTP_PORT;

const SMTP_OPTIONS = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: IN_PROD,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
};

const FROM = `noreply@${APP_HOSTNAME}`;

module.exports = { SMTP_OPTIONS, FROM };
