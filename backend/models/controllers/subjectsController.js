const memStore = require('../memStore');
let Subject;
try { Subject = require('../models/Subject'); } catch(e) {}

exports.getSubjects = async (req, res) => {
  try {
    if (memStore.isActive) {
      const subjects = await memStore.getSubjects(req.user._id);
      return res.json({ success: true, subjects });
    }
    const subjects = await Subject.find({ user: req.user._id }).sort({ name: 1 });
    res.json({ success: true, subjects });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getSubject = async (req, res) => {
  try {
    if (memStore.isActive) {
      const subject = await memStore.getSubject(req.params.id);
      if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
      return res.json({ success: true, subject });
    }
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, subject });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, color, icon, topics } = req.body;
    if (memStore.isActive) {
      const topicDocs = (topics || []).map(t => ({
        _id: `t_${Math.random().toString(36).slice(2)}`,
        name: typeof t === 'string' ? t : t.name, completed: false
      }));
      const subject = await memStore.createSubject({ user: req.user._id, name, code, color, icon: icon || 'fa-book', topics: topicDocs, totalTopics: topicDocs.length, completedTopics: 0, progress: 0 });
      return res.status(201).json({ success: true, subject });
    }
    const topicDocs = (topics || []).map(t => typeof t === 'string' ? { name: t } : t);
    const subject = await Subject.create({ user: req.user._id, name, code, color, icon, topics: topicDocs, totalTopics: topicDocs.length });
    res.status(201).json({ success: true, subject });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSubject = async (req, res) => {
  try {
    if (memStore.isActive) {
      const subject = await memStore.updateSubject(req.params.id, req.body);
      if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
      return res.json({ success: true, subject });
    }
    const subject = await Subject.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, subject });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSubject = async (req, res) => {
  try {
    if (memStore.isActive) {
      await memStore.deleteSubject(req.params.id);
      return res.json({ success: true, message: 'Subject deleted' });
    }
    await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Subject deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.toggleTopic = async (req, res) => {
  try {
    if (memStore.isActive) {
      const subject = await memStore.getSubject(req.params.id);
      if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
      const topics = (subject.topics || []).map(t => {
        if (String(t._id) === String(req.params.topicId)) {
          return { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : undefined };
        }
        return t;
      });
      const completedTopics = topics.filter(t => t.completed).length;
      const progress = topics.length ? Math.round((completedTopics / topics.length) * 100) : 0;
      const updated = await memStore.updateSubject(req.params.id, { topics, completedTopics, progress });
      return res.json({ success: true, subject: updated });
    }
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    const topic = subject.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    topic.completed = !topic.completed;
    topic.completedAt = topic.completed ? new Date() : undefined;
    subject.completedTopics = subject.topics.filter(t => t.completed).length;
    subject.progress = Math.round((subject.completedTopics / subject.totalTopics) * 100);
    await subject.save();
    res.json({ success: true, subject });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addTopic = async (req, res) => {
  try {
    if (memStore.isActive) {
      const subject = await memStore.getSubject(req.params.id);
      if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
      const newTopic = { _id: `t_${Math.random().toString(36).slice(2)}`, name: req.body.name, completed: false };
      const topics = [...(subject.topics || []), newTopic];
      const updated = await memStore.updateSubject(req.params.id, { topics, totalTopics: topics.length });
      return res.json({ success: true, subject: updated });
    }
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    subject.topics.push({ name: req.body.name });
    subject.totalTopics = subject.topics.length;
    await subject.save();
    res.json({ success: true, subject });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
