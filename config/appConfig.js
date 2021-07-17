const { NODE_ENV, APP_PROTOCOL, APP_HOSTNAME, APP_PORT, APP_SECRET } =
  process.env;

const IN_PROD = NODE_ENV === 'production';

const APP_URL = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`;

module.exports = {
  NODE_ENV,
  APP_PROTOCOL,
  APP_HOSTNAME,
  APP_PORT,
  APP_SECRET,
  IN_PROD,
  APP_URL,
};
