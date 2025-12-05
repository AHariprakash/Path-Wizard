const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ email, passwordHash, fullName, username });
    await newUser.save();

    const token = signToken({ userId: newUser._id });

    res.json({ token, user: newUser });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken({ userId: user._id });

    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
