const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { noteSchema } = require('./Note');
const { Token } = require('./Token');
const { sendMail } = require('../services/mailService');
const { BCRYPT_WORK_FACTOR, DUMMY_HASH } = require('../config/bcryptConfig');
const { FRONTEND_URL } = require('../config/appConfig');
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

userSchema.methods.sendConfirmationEmail = async function () {
  const token = new Token({
    userId: this._id,
    expires: Date.now() + EMAIL_VERIFICATION_TIMEOUT,
  });
  await token.save();

  const url = FRONTEND_URL + `/users/email/verify?tokenId=${token._id}`;

  return sendMail({
    to: this.email,
    subject: 'Please confirm your email',
    text: `Please click on this link to verify your email: ${url}`,
  });
};

userSchema.methods.sendPasswordResetEmail = async function () {
  const token = new Token({
    userId: this._id,
    expires: Date.now() + PASSWORD_RESET_TIMEOUT,
  });
  await token.save();

  const url = FRONTEND_URL + `/users/password/reset?tokenId=${token._id}`;

  return sendMail({
    to: this.email,
    subject: 'Password reset',
    text: `Please click on this link to reset your password: ${url}`,
  });
};

userSchema.methods.isVerified = function () {
  return !!this.verifiedAt;
};

userSchema.statics.comparePassword = function (plainTextPwd, hashedPwd) {
  // using dummy hash to mitigate timing attack
  return bcrypt.compare(plainTextPwd, hashedPwd || DUMMY_HASH);
};

userSchema.statics.verifyToken = async function (tokenId) {
  const token = await Token.findById(tokenId);

  if (token?.hasExpired()) {
    await token.remove();
    return false;
  }

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };
