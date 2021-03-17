const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { SESSION_OPTIONS } = require('../config/sessionConfig');
const { MONGO_STORE_OPTIONS } = require('../config/mongoStoreConfig');

module.exports = app => {
  // body parser
  app.use(express.json());

  // session
  app.use(
    session({
      ...SESSION_OPTIONS,
      store: MongoStore.create(MONGO_STORE_OPTIONS),
    })
  );
};
