const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models (used when MongoDB is available)
let User, Subject, Progress;
try {
  User = require('../models/User');
  Subject = require('../models/Subject');
  Progress = require('../models/Progress');
} catch(e) {}

const memStore = require('../memStore');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_change_me', {
  expiresIn: process.env.JWT_EXPIRE || '7d'
});

const defaultSubjects = [
  { name: 'Data Structures',   code: 'DS',   color: '#3b82f6', icon: 'fa-sitemap',       topics: ['Arrays & Strings','Linked Lists','Stacks & Queues','Trees','Graphs','Hashing','Sorting Algorithms','Searching Algorithms'] },
  { name: 'DBMS',              code: 'DBMS', color: '#8b5cf6', icon: 'fa-database',      topics: ['ER Model','Relational Model','SQL Basics','Normalization','Transactions','Indexing','Query Optimization'] },
  { name: 'Operating Systems', code: 'OS',   color: '#10b981', icon: 'fa-server',        topics: ['Process Management','CPU Scheduling','Memory Management','File Systems','Deadlocks','Synchronization','Virtual Memory'] },
  { name: 'Computer Networks', code: 'CN',   color: '#f59e0b', icon: 'fa-network-wired', topics: ['OSI Model','TCP/IP','HTTP/HTTPS','DNS','Routing','Subnetting','Network Security'] },
  { name: 'Python Programming',code: 'PY',   color: '#ef4444', icon: 'fa-python',        topics: ['Basics & Syntax','Functions','OOP','File Handling','Libraries','Django/Flask','Data Science'] },
  { name: 'Mathematics',       code: 'MATH', color: '#06b6d4', icon: 'fa-calculator',    topics: ['Discrete Mathematics','Linear Algebra','Calculus','Probability','Statistics','Graph Theory'] }
];

// ─── Register ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, college, semester } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    if (memStore.isActive) {
      // In-memory mode
      const existing = await memStore.findUser({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 12);
      const user = await memStore.createUser({ name, email, password: hashed, college: college || '', semester: semester || '' });

      // Create default subjects in memory
      for (const s of defaultSubjects) {
        await memStore.createSubject({
          user: user._id, name: s.name, code: s.code, color: s.color, icon: s.icon,
          topics: s.topics.map(t => ({ _id: `t_${Math.random().toString(36).slice(2)}`, name: t, completed: false })),
          totalTopics: s.topics.length, completedTopics: 0, progress: 0
        });
      }
      await memStore.getProgress(user._id); // create progress record

      const token = generateToken(user._id);
      return res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, college, semester } });
    }

    // MongoDB mode
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, college: college || '', semester: semester || '' });

    await Promise.all(defaultSubjects.map(s => Subject.create({
      user: user._id, name: s.name, code: s.code, color: s.color, icon: s.icon,
      topics: s.topics.map(t => ({ name: t, completed: false })),
      totalTopics: s.topics.length
    })));

    await Progress.create({ user: user._id });

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, college, semester } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    if (memStore.isActive) {
      const user = await memStore.findUser({ email });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });
      const token = generateToken(user._id);
      return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, college: user.college, semester: user.semester, studyStreak: user.studyStreak || 0 } });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, college: user.college, semester: user.semester, studyStreak: user.studyStreak } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get current user ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    if (memStore.isActive) {
      const user = await memStore.findUser({ _id: req.user._id });
      return res.json({ success: true, user });
    }
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Update profile ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, college, semester, studyGoal, preferences } = req.body;
    if (memStore.isActive) {
      const user = await memStore.updateUser(req.user._id, { name, college, semester, studyGoal, preferences });
      return res.json({ success: true, user });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { name, college, semester, studyGoal, preferences }, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Change password ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (memStore.isActive) {
      const user = await memStore.findUser({ _id: req.user._id });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      const hashed = await bcrypt.hash(newPassword, 12);
      await memStore.updateUser(req.user._id, { password: hashed });
      return res.json({ success: true, message: 'Password changed successfully' });
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
