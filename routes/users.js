const express = require('express');
const _ = require('lodash');
const { User } = require('../models/User');
const authService = require('../services/authService');
const { BadRequest } = require('../errors/customErrors');
const catchAsyncErr = require('../middleware/catchAsyncErr');

const router = express.Router();

router.get(
  '/profile',
  catchAsyncErr(async (req, res) => {
    const user = await User.findById(req.session.userId).select('-password');
    res.json({ success: true, message: 'User details', user });
  })
);

router.post(
  '/register',
  catchAsyncErr(async (req, res) => {
    const userExists = await User.exists({ email: req.body.email });

    if (userExists) {
      throw new BadRequest('User already registered');
    }

    const user = new User(req.body);
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
  catchAsyncErr(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new BadRequest('Invalid email or password');
    }

    const validPassword = await user.comparePassword(req.body.password);

    if (!validPassword) {
      throw new BadRequest('Invalid email or password');
    }

    authService.login(req, user._id);

    res.json({ success: true, message: 'User logged in' });
  })
);

router.post(
  '/logout',
  catchAsyncErr((req, res) => {
    authService.logout(req, res);
  })
);

module.exports = router;
