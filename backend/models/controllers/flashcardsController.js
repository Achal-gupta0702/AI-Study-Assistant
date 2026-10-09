const memStore = require('../memStore');
let Flashcard;
try { Flashcard = require('../models/Flashcard'); } catch(e) {}

exports.getSets = async (req, res) => {
  try {
    if (memStore.isActive) {
      const sets = await memStore.getSets(req.user._id);
      return res.json({ success: true, sets });
    }
    const sets = await Flashcard.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, sets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getSet = async (req, res) => {
  try {
    if (memStore.isActive) {
      const set = await memStore.getSet(req.params.id);
      if (!set) return res.status(404).json({ success: false, message: 'Set not found' });
      return res.json({ success: true, set });
    }
    const set = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
    if (!set) return res.status(404).json({ success: false, message: 'Set not found' });
    res.json({ success: true, set });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSet = async (req, res) => {
  try {
    const { title, subject, topic, cards } = req.body;
    if (memStore.isActive) {
      const set = await memStore.createSet({ user: req.user._id, title, subject, topic, cards: cards || [], totalCards: (cards||[]).length, knownCount: 0, reviewCount: 0, lastStudied: new Date() });
      return res.status(201).json({ success: true, set });
    }
    const set = await Flashcard.create({ user: req.user._id, title, subject, topic, cards, totalCards: cards.length, lastStudied: new Date() });
    res.status(201).json({ success: true, set });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateCard = async (req, res) => {
  try {
    const { cardIndex, isKnown, needsReview } = req.body;
    if (memStore.isActive) {
      const set = await memStore.getSet(req.params.id);
      if (!set) return res.status(404).json({ success: false, message: 'Set not found' });
      const cards = [...(set.cards || [])];
      if (cards[cardIndex] !== undefined) {
        cards[cardIndex] = { ...cards[cardIndex], isKnown, needsReview };
      }
      const updated = await memStore.updateSet(req.params.id, {
        cards,
        knownCount: cards.filter(c => c.isKnown).length,
        reviewCount: cards.filter(c => c.needsReview).length,
        lastStudied: new Date()
      });
      return res.json({ success: true, set: updated });
    }
    const set = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
    if (!set) return res.status(404).json({ success: false, message: 'Set not found' });
    if (set.cards[cardIndex] !== undefined) {
      set.cards[cardIndex].isKnown = isKnown;
      set.cards[cardIndex].needsReview = needsReview;
    }
    set.knownCount = set.cards.filter(c => c.isKnown).length;
    set.reviewCount = set.cards.filter(c => c.needsReview).length;
    set.lastStudied = new Date();
    await set.save();
    res.json({ success: true, set });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSet = async (req, res) => {
  try {
    if (memStore.isActive) {
      await memStore.deleteSet(req.params.id);
      return res.json({ success: true, message: 'Flashcard set deleted' });
    }
    await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Flashcard set deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
