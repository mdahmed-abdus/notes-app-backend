const express = require('express');
const _ = require('lodash');
const { User } = require('../models/User');
const authService = require('../services/authService');
const { BadRequest } = require('../errors/customErrors');
const catchAsyncErr = require('../middleware/catchAsyncErr');
const { auth, active, guest } = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../validators/userValidator');

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
    const validPassword = await user?.comparePassword(req.body.password);

    if (!user || !validPassword) {
      throw new BadRequest('Invalid email or password');
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

module.exports = router;
