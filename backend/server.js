const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api/', limiter);

// ─── Static frontend ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/ai',         require('./routes/ai'));
app.use('/api/notes',      require('./routes/notes'));
app.use('/api/quiz',       require('./routes/quiz'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/planner',    require('./routes/planner'));
app.use('/api/progress',   require('./routes/progress'));
app.use('/api/subjects',   require('./routes/subjects'));
app.use('/api/profile',    require('./routes/profile'));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Study Assistant API is running',
    db: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory',
    time: new Date().toISOString()
  });
});

// ─── SPA fallback ────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Error handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── Database connection ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`\n🚀 AI Study Assistant running on http://localhost:${PORT}`);
    console.log(`📚 Frontend  : http://localhost:${PORT}`);
    console.log(`🔌 API       : http://localhost:${PORT}/api`);
    console.log(`🩺 Health    : http://localhost:${PORT}/api/health`);
    console.log(`💾 Database  : ${mongoose.connection.readyState === 1 ? '✅ MongoDB' : '⚠️  In-Memory (MongoDB not connected)'}\n`);
  });
};

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study-assistant';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ MongoDB connected at', mongoUri);
    startServer();
  } catch (err) {
    console.warn('⚠️  MongoDB not available:', err.message);
    console.log('🔄 Switching to in-memory store for demo mode...');
    // Mark memStore as active so controllers can use it
    const memStore = require('./memStore');
    memStore.isActive = true;
    startServer();
  }
})();
