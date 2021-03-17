const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config/bcryptConfig');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, BCRYPT_WORK_FACTOR);
  next();
});

// method to compare passwords
userSchema.methods.comparePassword = function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };
