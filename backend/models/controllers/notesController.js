const memStore = require('../memStore');
let Note;
try { Note = require('../models/Note'); } catch(e) {}

exports.getNotes = async (req, res) => {
  try {
    const { subject, search, page = 1, limit = 20 } = req.query;
    if (memStore.isActive) {
      const notes = await memStore.getNotes(req.user._id, { subject: subject !== 'all' ? subject : null, search });
      return res.json({ success: true, notes, total: notes.length });
    }
    const query = { user: req.user._id };
    if (subject && subject !== 'all') query.subject = subject;
    if (search) query.$text = { $search: search };
    const notes = await Note.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await Note.countDocuments(query);
    res.json({ success: true, notes, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getNote = async (req, res) => {
  try {
    if (memStore.isActive) {
      const note = await memStore.getNote(req.params.id);
      if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
      return res.json({ success: true, note });
    }
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createNote = async (req, res) => {
  try {
    if (memStore.isActive) {
      const note = await memStore.createNote({ ...req.body, user: req.user._id });
      return res.status(201).json({ success: true, note });
    }
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateNote = async (req, res) => {
  try {
    if (memStore.isActive) {
      const note = await memStore.updateNote(req.params.id, req.body);
      if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
      return res.json({ success: true, note });
    }
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteNote = async (req, res) => {
  try {
    if (memStore.isActive) {
      await memStore.deleteNote(req.params.id);
      return res.json({ success: true, message: 'Note deleted' });
    }
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.toggleFavorite = async (req, res) => {
  try {
    if (memStore.isActive) {
      const note = await memStore.getNote(req.params.id);
      if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
      const updated = await memStore.updateNote(req.params.id, { isFavorite: !note.isFavorite });
      return res.json({ success: true, note: updated });
    }
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    note.isFavorite = !note.isFavorite;
    await note.save();
    res.json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
