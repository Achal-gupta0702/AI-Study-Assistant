const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  userAnswer: { type: Number, default: -1 }
});

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  questions: [questionSchema],
  totalQuestions: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  weakTopics: [{ type: String }],
  analysis: { type: String, default: '' }
}, { timestamps: true });

quizSchema.index({ user: 1, subject: 1, completed: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
