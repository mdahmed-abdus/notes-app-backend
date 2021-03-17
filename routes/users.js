const express = require('express');
const { User } = require('../models/User');
const authService = require('../services/authService');

const router = express.Router();

router.get('/profile', async (req, res) => {
  const user = await User.findById(req.session.userId).select('-password');
  res.json({ success: true, message: 'User details', user });
});

router.post('/register', async (req, res) => {
  const userExists = await User.exists({ email: req.body.email });

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: 'User already registered' });
  }

  const user = new User(req.body);
  await user.save();

  delete user.password;

  res.status(201).json({ success: true, message: 'User registered', user });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email or password' });
  }

  const validPassword = await user.comparePassword(req.body.password);

  if (!validPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email or password' });
  }

  authService.login(req, user._id);

  res.json({ success: true, message: 'User logged in' });
});

router.post('/logout', (req, res) => {
  authService.logout(req, res);
});

module.exports = router;
