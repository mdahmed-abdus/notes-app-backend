const express = require('express');
const _ = require('lodash');
const { User } = require('../models/User');
const authService = require('../services/authService');
const { BadRequest, Forbidden } = require('../errors/customErrors');
const catchAsyncErr = require('../middleware/catchAsyncErr');
const validateTokenId = require('../middleware/validateTokenId');
const { auth, active, guest } = require('../middleware/authMiddleware');
const {
  registerSchema,
  loginSchema,
  resendEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/userValidator');
const removeUserSessions = require('../scripts/removeUserSessions');

const router = express.Router();

router.get(
  '/',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const user = await User.findById(req.session.userId).select('-password');
    res.json({ success: true, message: 'User details', user });
  })
);

router.post(
  '/register',
  guest,
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = registerSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const { name, email, password } = req.body;

    if (await User.exists({ email })) {
      throw new BadRequest('User already registered');
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered',
      user: _.pick(user, ['_id', 'name', 'email', 'createdAt']),
    });

    await user.sendConfirmationEmail();
  })
);

router.post(
  '/login',
  guest,
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = loginSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });
    const validPassword = await User.comparePassword(
      req.body.password,
      user?.password
    );

    if (!user || !validPassword) {
      throw new BadRequest('Invalid email or password');
    }

    if (!user.isVerified()) {
      throw new Forbidden('Email not verified');
    }

    authService.login(req, user._id);

    res.json({ success: true, message: 'User logged in' });
  })
);

router.post(
  '/logout',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    await authService.logout(req, res);
    res.json({ success: true, message: 'User logged out' });
  })
);

router.post(
  '/email/resend',
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = resendEmailSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user || user?.isVerified()) {
      throw new BadRequest('Invalid email or already verified');
    }

    await user.sendConfirmationEmail();

    res.json({ success: true, message: 'Email sent' });
  })
);

router.post(
  '/email/verify',
  validateTokenId,
  catchAsyncErr(async (req, res) => {
    const token = await User.verifyToken(req.query.tokenId);
    if (!token) {
      throw new BadRequest('Invalid token');
    }

    const user = await User.findById(token.userId);
    if (!user || user?.isVerified()) {
      throw new BadRequest('Invalid email or already verified');
    }

    user.verifiedAt = new Date();
    await user.save();
    await token.remove();

    res.json({ success: true, message: 'Email verified' });
  })
);

router.post(
  '/password/forgot',
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = forgotPasswordSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user || !user?.isVerified()) {
      throw new BadRequest('Invalid email');
    }

    await user.sendPasswordResetEmail();

    res.json({ success: true, message: 'Mail sent' });
  })
);

router.post(
  '/password/reset',
  validateTokenId,
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = resetPasswordSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const token = await User.verifyToken(req.query.tokenId);
    if (!token) {
      throw new BadRequest('Invalid token');
    }

    const user = await User.findById(token.userId);
    if (!user || !user?.isVerified()) {
      throw new BadRequest('Invalid email or user not verified');
    }

    user.password = req.body.password;
    await user.save();
    await token.remove();
    await removeUserSessions(user._id);

    res.json({ success: true, message: 'Password changed successfully' });
  })
);

module.exports = router;
