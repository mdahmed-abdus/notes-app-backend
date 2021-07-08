const mongoose = require('mongoose');
const { BadRequest } = require('../errors/customErrors');

module.exports = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new BadRequest('Invalid id'));
  }
  next();
};
