const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  avatar: { type: String, default: '' },
  college: { type: String, default: '' },
  semester: { type: String, default: '' },
  branch: { type: String, default: 'B.Tech CSE' },
  studyGoal: { type: Number, default: 4 }, // hours per day
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  studyStreak: { type: Number, default: 0 },
  totalStudyHours: { type: Number, default: 0 },
  lastStudyDate: { type: Date },
  preferences: {
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
