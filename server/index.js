// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/career-mapper";

/**
 * Connect to MongoDB
 */
async function connectMongo(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
connectMongo(MONGO_URI);

/**
 * User model
 */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, default: "" },
  username: { type: String, unique: true, sparse: true, trim: true },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  college: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  planner: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

/**
 * Helper: generate JWT token
 */
function generateToken(userDoc) {
  const payload = { userId: userDoc._id.toString(), email: userDoc.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

/**
 * Middleware: verify token and attach user payload to req.user
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return res.status(401).json({ error: "Authorization header required" });

  const parts = header.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Registration endpoint
 */
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });

    if (username) {
      const nameTaken = await User.findOne({ username });
      if (nameTaken) return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = new User({ email, passwordHash: hashedPassword, fullName: fullName || "", username: username || "" });
    await created.save();

    const token = generateToken(created);
    const safeUser = {
      id: created._id,
      email: created.email,
      fullName: created.fullName,
      username: created.username,
      avatarUrl: created.avatarUrl
    };
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) return res.status(409).json({ error: "Email or username already exists" });
    res.status(500).json({ error: "User registration failed" });
  }
});

/**
 * Login endpoint
 */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken(user);
    const safeUser = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      avatarUrl: user.avatarUrl
    };
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * Profile endpoints
 */
app.get("/api/profile/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/api/profile/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const allowed = ["fullName", "username", "bio", "phone", "college", "avatarUrl"];
    const updates = {};
    allowed.forEach(k => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    if (updates.username) {
      const existing = await User.findOne({ username: updates.username, _id: { $ne: userId } });
      if (existing) return res.status(409).json({ error: "Username already taken" });
    }

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-passwordHash -__v");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * Planner endpoints
 */
app.get("/api/planner", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const u = await User.findById(userId).select("planner");
    res.json(u?.planner || {});
  } catch (err) {
    console.error("Get planner error:", err);
    res.status(500).json({ error: "Failed to load planner" });
  }
});

app.post("/api/planner", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const planner = req.body || {};
    const updated = await User.findByIdAndUpdate(userId, { $set: { planner } }, { new: true, projection: { planner: 1 } });
    res.json(updated.planner || {});
  } catch (err) {
    console.error("Save planner error:", err);
    res.status(500).json({ error: "Failed to save planner" });
  }
});

// Simple root route
app.get('/', (req, res) => {
  res.send('Career Mapper API — running. Use /api/register, /api/login, /api/profile/me');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
