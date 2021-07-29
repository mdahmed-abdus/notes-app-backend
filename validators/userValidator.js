const Joi = require('joi');
const { BCRYPT_MAX_BYTES } = require('../config/bcryptConfig');

const name = Joi.string().trim().min(3).max(128).required();

const email = Joi.string().trim().email().min(8).max(254).required();

const password = Joi.string()
  .min(8)
  .max(BCRYPT_MAX_BYTES, 'utf8')
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
  .message('Password must contain at least: 1 uppercase, 1 lowercase, 1 digit')
  .required();

const confirmPassword = Joi.valid(Joi.ref('password')).required();

const registerSchema = Joi.object({ name, email, password, confirmPassword });

const loginSchema = Joi.object({ email, password });

const resendEmailSchema = Joi.object({ email });

const forgotPasswordSchema = Joi.object({ email });

const resetPasswordSchema = Joi.object({ password, confirmPassword });

module.exports = {
  registerSchema,
  loginSchema,
  resendEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
