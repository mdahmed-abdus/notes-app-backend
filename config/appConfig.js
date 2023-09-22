const { NODE_ENV, FRONTEND_URL, APP_HOSTNAME, APP_PORT } = process.env;

const IN_PROD = NODE_ENV === 'production';

const APP_PROTOCOL = IN_PROD ? 'https' : 'http';

const APP_URL = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`;

module.exports = {
  NODE_ENV,
  FRONTEND_URL,
  APP_PROTOCOL,
  APP_HOSTNAME,
  APP_PORT,
  IN_PROD,
  APP_URL,
};
