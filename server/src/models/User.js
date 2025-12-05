const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, default: '' },
  username: { type: String, unique: true, sparse: true, trim: true },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  college: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
