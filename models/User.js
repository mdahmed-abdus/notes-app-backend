const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { noteSchema } = require('./Note');
const { sendMail } = require('../services/mailService');
const { BCRYPT_WORK_FACTOR } = require('../config/bcryptConfig');
const { APP_URL } = require('../config/appConfig');
const { JWT_PRIVATE_KEY } = require('../config/keys');
const {
  EMAIL_VERIFICATION_TIMEOUT,
  PASSWORD_RESET_TIMEOUT,
} = require('../config/authConfig');

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
    notes: [noteSchema],
    verifiedAt: Date,
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, BCRYPT_WORK_FACTOR);
  }
  next();
});

// method to compare passwords
userSchema.methods.comparePassword = function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};

userSchema.methods.sendConfirmationEmail = function () {
  const token = jwt.sign({ _id: this._id }, JWT_PRIVATE_KEY, {
    expiresIn: EMAIL_VERIFICATION_TIMEOUT,
  });

  const url = APP_URL + `/users/email/verify?token=${token}`;

  return sendMail({
    to: this.email,
    subject: 'Please confirm your email',
    text: `Please click on this link to verify your email: ${url}`,
  });
};

userSchema.methods.sendPasswordResetEmail = function () {
  const token = jwt.sign({ _id: this._id }, JWT_PRIVATE_KEY, {
    expiresIn: PASSWORD_RESET_TIMEOUT,
  });

  const url = APP_URL + `/users/password/reset?token=${token}`;

  return sendMail({
    to: this.email,
    subject: 'Password reset',
    text: `Please click on this link to reset your password: ${url}`,
  });
};

userSchema.methods.isVerified = function () {
  return !!this.verifiedAt;
};

userSchema.statics.verifyToken = function (token) {
  try {
    return jwt.verify(token, JWT_PRIVATE_KEY);
  } catch {}
};

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };
