const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');
  res.json(user);
});

router.put('/me', auth, async (req, res) => {
  const allowed = ['fullName', 'username', 'bio', 'phone', 'college', 'avatarUrl'];
  const updates = {};

  allowed.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const updated = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-passwordHash');

  res.json(updated);
});

module.exports = router;
