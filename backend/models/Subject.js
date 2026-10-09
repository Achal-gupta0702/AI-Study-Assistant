const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const subjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  code: { type: String, default: '' },
  semester: { type: String, default: '' },
  color: { type: String, default: '#3b82f6' },
  icon: { type: String, default: 'fa-book' },
  topics: [topicSchema],
  totalTopics: { type: Number, default: 0 },
  completedTopics: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  studyHours: { type: Number, default: 0 },
  quizAvgScore: { type: Number, default: 0 }
}, { timestamps: true });

subjectSchema.index({ user: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
