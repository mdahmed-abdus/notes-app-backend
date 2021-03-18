const users = require('./users');
const notes = require('./notes');

module.exports = app => {
  app.use('/users', users);
  app.use('/notes', notes);
};
