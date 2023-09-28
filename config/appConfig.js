const {
  NODE_ENV,
  FRONTEND_URL,
  APP_HOSTNAME,
  APP_PORT: ENV_APP_PORT,
  PORT,
} = process.env;

const APP_PORT = PORT ? PORT : ENV_APP_PORT;

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
