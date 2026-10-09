const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  studyHours: { type: Number, default: 0 },
  topicsStudied: [String],
  quizzesTaken: { type: Number, default: 0 },
  avgQuizScore: { type: Number, default: 0 },
  flashcardsReviewed: { type: Number, default: 0 }
});

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalStudyHours: { type: Number, default: 0 },
  totalQuizzesTaken: { type: Number, default: 0 },
  avgQuizScore: { type: Number, default: 0 },
  totalFlashcardsReviewed: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastStudyDate: Date,
  weeklyHours: [{ week: String, hours: Number }],
  subjectProgress: [{
    subject: String,
    studyHours: Number,
    quizAvg: Number,
    progress: Number,
    strongTopics: [String],
    weakTopics: [String]
  }],
  dailyLogs: [dailyLogSchema],
  achievements: [{ name: String, description: String, earnedAt: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
