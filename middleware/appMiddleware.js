const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { IN_PROD } = require('../config/appConfig');
const { CORS_OPTIONS } = require('../config/corsConfig');
const { SESSION_OPTIONS } = require('../config/sessionConfig');
const { MONGO_STORE_OPTIONS } = require('../config/mongoStoreConfig');

module.exports = app => {
  app.set('trust proxy', true);

  // cors
  app.use(cors(CORS_OPTIONS));

  // body parser
  app.use(express.json());

  if (IN_PROD) {
    app.use(helmet());
    app.use(mongoSanitize());
  } else {
    const morgan = require('morgan');
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
