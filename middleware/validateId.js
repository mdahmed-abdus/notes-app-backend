const mongoose = require('mongoose');
const { BadRequest } = require('../errors/customErrors');

module.exports = (req, res, next, id) => {
  const validId = mongoose.Types.ObjectId.isValid(id);

  if (!validId) {
    return next(new BadRequest('Invalid id'));
  }

  next();
};
