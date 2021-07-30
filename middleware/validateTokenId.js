const validateId = require('./validateId');
const { BadRequest } = require('../errors/customErrors');

module.exports = (req, res, next) =>
  validateId(req, res, next, req.query.tokenId);
