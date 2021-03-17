const { MONGO_URI } = require('./mongoDbConfig');
const { SESSION_IDLE_TIMEOUT } = require('./sessionConfig');

const MONGO_STORE_OPTIONS = {
  mongoUrl: MONGO_URI,
  ttl: SESSION_IDLE_TIMEOUT,
};

module.exports = { MONGO_STORE_OPTIONS };
