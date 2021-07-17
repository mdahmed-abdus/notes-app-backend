const {
  APP_PORT = 3000,
  NODE_ENV = 'development',
  APP_HOSTNAME = 'localhost',
} = process.env;

const IN_PROD = NODE_ENV === 'production';

module.exports = { APP_PORT, NODE_ENV, APP_HOSTNAME, IN_PROD };
