const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

tokenSchema.methods.hasExpired = function () {
  return Date.now() > this.expires;
};

const Token = mongoose.model('Token', tokenSchema);

module.exports = { tokenSchema, Token };
