const memStore = require('../memStore');
let Progress, Quiz;
try { Progress = require('../models/Progress'); Quiz = require('../models/Quiz'); } catch(e) {}

exports.getProgress = async (req, res) => {
  try {
    if (memStore.isActive) {
      const progress = await memStore.getProgress(req.user._id);
      return res.json({ success: true, progress });
    }
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) progress = await Progress.create({ user: req.user._id });
    res.json({ success: true, progress });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.logStudySession = async (req, res) => {
  try {
    const { hours, subject, topicsStudied } = req.body;
    const today = new Date(); today.setHours(0, 0, 0, 0);

    if (memStore.isActive) {
      const progress = await memStore.getProgress(req.user._id);
      const totalStudyHours = (progress.totalStudyHours || 0) + (hours || 0);
      // Streak calculation
      const lastDate = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
      let currentStreak = progress.currentStreak || 0;
      if (!lastDate) {
        currentStreak = 1;
      } else {
        const lastDay = new Date(lastDate); lastDay.setHours(0,0,0,0);
        const diffDays = Math.round((today.getTime() - lastDay.getTime()) / 86400000);
        if (diffDays === 0) { /* same day, no change */ }
        else if (diffDays === 1) { currentStreak += 1; }
        else { currentStreak = 1; }
      }
      const longestStreak = Math.max(progress.longestStreak || 0, currentStreak);
      // Daily log
      const dailyLogs = [...(progress.dailyLogs || [])];
      const todayStr = today.toDateString();
      const todayIdx = dailyLogs.findIndex(l => new Date(l.date).toDateString() === todayStr);
      if (todayIdx >= 0) {
        dailyLogs[todayIdx] = { ...dailyLogs[todayIdx], studyHours: (dailyLogs[todayIdx].studyHours || 0) + (hours || 0) };
      } else {
        dailyLogs.push({ date: today, studyHours: hours || 0, topicsStudied: topicsStudied || [] });
      }
      const trimmed = dailyLogs.slice(-30);
      const updated = await memStore.updateProgress(req.user._id, { totalStudyHours, currentStreak, longestStreak, lastStudyDate: new Date(), dailyLogs: trimmed });
      return res.json({ success: true, progress: updated });
    }

    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) progress = new Progress({ user: req.user._id });

    progress.totalStudyHours += hours || 0;
    const lastDate = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    if (!lastDate) {
      progress.currentStreak = 1;
    } else {
      const lastDay = new Date(lastDate); lastDay.setHours(0,0,0,0);
      const diffDays = Math.round((today.getTime() - lastDay.getTime()) / 86400000);
      if (diffDays === 0) { /* same day */ }
      else if (diffDays === 1) { progress.currentStreak += 1; }
      else { progress.currentStreak = 1; }
    }
    if (progress.currentStreak > progress.longestStreak) progress.longestStreak = progress.currentStreak;
    progress.lastStudyDate = new Date();

    let dayLog = progress.dailyLogs.find(l => new Date(l.date).toDateString() === today.toDateString());
    if (!dayLog) {
      progress.dailyLogs.push({ date: today, studyHours: hours || 0, topicsStudied: topicsStudied || [] });
    } else {
      dayLog.studyHours += hours || 0;
      if (topicsStudied) dayLog.topicsStudied.push(...topicsStudied);
    }
    if (progress.dailyLogs.length > 30) progress.dailyLogs = progress.dailyLogs.slice(-30);
    await progress.save();
    res.json({ success: true, progress });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    if (memStore.isActive) {
      const progress = await memStore.getProgress(req.user._id);
      const quizzes = await memStore.getQuizzes(req.user._id, { completed: true });
      const weeklyData = (progress.dailyLogs || []).slice(-7).map(l => ({ date: l.date, hours: l.studyHours }));
      const quizPerformance = quizzes.slice(0, 10).map(q => ({ subject: q.subject, topic: q.topic, score: q.percentage, date: q.completedAt }));
      return res.json({ success: true, weeklyData, quizPerformance, progress });
    }
    const quizzes = await Quiz.find({ user: req.user._id, completed: true }).sort({ completedAt: -1 }).limit(20);
    const progress = await Progress.findOne({ user: req.user._id });
    const last7days = progress?.dailyLogs?.slice(-7) || [];
    const weeklyData = last7days.map(l => ({ date: l.date, hours: l.studyHours }));
    const quizPerformance = quizzes.slice(0, 10).map(q => ({ subject: q.subject, topic: q.topic, score: q.percentage, date: q.completedAt }));
    res.json({ success: true, weeklyData, quizPerformance, progress });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
