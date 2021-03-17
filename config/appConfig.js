const { APP_PORT = 3000, NODE_ENV = 'development' } = process.env;

const IN_PROD = NODE_ENV === 'production';

module.exports = { APP_PORT, NODE_ENV, IN_PROD };
