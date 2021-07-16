const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { IN_PROD } = require('../config/appConfig');
const { CORS_OPTIONS } = require('../config/corsConfig');
const { SESSION_OPTIONS } = require('../config/sessionConfig');
const { MONGO_STORE_OPTIONS } = require('../config/mongoStoreConfig');

module.exports = app => {
  // cors
  app.use(cors(CORS_OPTIONS));

  // body parser
  app.use(express.json());

  if (!IN_PROD) {
    app.use(morgan('dev'));
  }

  // session
  app.use(
    session({
      ...SESSION_OPTIONS,
      store: MongoStore.create(MONGO_STORE_OPTIONS),
    })
  );
};
