const users = require('./users');
const notes = require('./notes');
const notFound = require('../errors/notFound');

module.exports = app => {
  app.use('/users', users);
  app.use('/notes', notes);
  app.use(notFound);
};
