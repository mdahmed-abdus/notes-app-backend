const { FRONTEND_URL } = require('../config/appConfig');

const CORS_OPTIONS = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

module.exports = { CORS_OPTIONS };
