const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  duration: Number, // in minutes
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  date: { type: Date, required: true },
  notes: String
});

const studyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Study Plan' },
  examDate: { type: Date },
  subjects: [String],
  dailyGoalHours: { type: Number, default: 4 },
  tasks: [taskSchema],
  weekStartDate: { type: Date },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 }
}, { timestamps: true });

studyPlanSchema.index({ user: 1, weekStartDate: 1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
