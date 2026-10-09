const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isKnown: { type: Boolean, default: false },
  needsReview: { type: Boolean, default: false }
});

const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, default: '' },
  cards: [cardSchema],
  totalCards: { type: Number, default: 0 },
  knownCount: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  lastStudied: { type: Date }
}, { timestamps: true });

flashcardSchema.index({ user: 1, subject: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
