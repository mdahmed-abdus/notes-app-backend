const { APP_HOSTNAME, IN_PROD } = require('./appConfig');
const { env } = process;

const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD } = env;
const SMTP_PORT = +env.SMTP_PORT;
const EMAIL_VERIFICATION_TIMEOUT = +env.EMAIL_VERIFICATION_TIMEOUT;
const PASSWORD_RESET_TIMEOUT = +env.PASSWORD_RESET_TIMEOUT;

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

module.exports = {
  SMTP_OPTIONS,
  FROM,
  EMAIL_VERIFICATION_TIMEOUT,
  PASSWORD_RESET_TIMEOUT,
};
