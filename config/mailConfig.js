const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
const { APP_HOSTNAME, IN_PROD } = require('./appConfig');

const SMTP_OPTIONS = {
  host: SMTP_HOST,
  port: +SMTP_PORT,
  secure: IN_PROD,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
};

const FROM = `noreply@${APP_HOSTNAME}`;

module.exports = { SMTP_OPTIONS, FROM };
