const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  originalText: { type: String, default: '' },
  subject: { type: String, default: 'General' },
  topic: { type: String, default: '' },
  summary: { type: String, default: '' },
  keyPoints: [{ type: String }],
  importantTerms: [{ term: String, definition: String }],
  examNotes: { type: String, default: '' },
  possibleQuestions: [{ type: String }],
  tags: [{ type: String }],
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

noteSchema.index({ user: 1, subject: 1 });
noteSchema.index({ title: 'text', summary: 'text', originalText: 'text' });

module.exports = mongoose.model('Note', noteSchema);
