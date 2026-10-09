const memStore = require('../memStore');
let Quiz, Progress;
try { Quiz = require('../models/Quiz'); Progress = require('../models/Progress'); } catch(e) {}

exports.getQuizzes = async (req, res) => {
  try {
    const { subject, completed } = req.query;
    if (memStore.isActive) {
      const filter = {};
      if (subject) filter.subject = subject;
      if (completed !== undefined) filter.completed = completed === 'true';
      const quizzes = await memStore.getQuizzes(req.user._id, filter);
      return res.json({ success: true, quizzes });
    }
    const query = { user: req.user._id };
    if (subject) query.subject = subject;
    if (completed !== undefined) query.completed = completed === 'true';
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, quizzes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createQuiz = async (req, res) => {
  try {
    if (memStore.isActive) {
      const quiz = await memStore.createQuiz({ ...req.body, user: req.user._id });
      return res.status(201).json({ success: true, quiz });
    }
    const quiz = await Quiz.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { userAnswers, timeTaken } = req.body;

    if (memStore.isActive) {
      const quiz = await memStore.getQuiz(req.params.id);
      if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

      let correct = 0;
      const questions = quiz.questions.map((q, i) => {
        const ua = Array.isArray(userAnswers) ? (userAnswers[i] ?? -1) : -1;
        if (ua === q.correctAnswer) correct++;
        return { ...q, userAnswer: ua };
      });

      const percentage = Math.round((correct / questions.length) * 100);
      const updatedQuiz = await memStore.updateQuiz(req.params.id, {
        questions, score: correct, percentage, timeTaken: timeTaken || 0,
        completed: true, completedAt: new Date(),
        weakTopics: questions.filter((q,i) => (userAnswers[i] ?? -1) !== q.correctAnswer).map(q => q.question.split(' ').slice(0,4).join(' ')),
        analysis: percentage >= 80 ? 'Excellent performance! 🎉' : percentage >= 60 ? 'Good effort. Review weak areas.' : 'Needs more practice. Review fundamentals.'
      });

      // Update progress in memory
      const allQuizzes = await memStore.getQuizzes(req.user._id, { completed: true });
      const newAvg = allQuizzes.length ? Math.round(allQuizzes.reduce((s,q) => s + (q.percentage||0), 0) / allQuizzes.length) : percentage;
      await memStore.updateProgress(req.user._id, { totalQuizzesTaken: allQuizzes.length, avgQuizScore: newAvg });
      return res.json({ success: true, quiz: updatedQuiz });
    }

    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      q.userAnswer = userAnswers[i] ?? -1;
      if (userAnswers[i] === q.correctAnswer) correct++;
    });

    quiz.score = correct;
    quiz.percentage = Math.round((correct / quiz.questions.length) * 100);
    quiz.timeTaken = timeTaken || 0;
    quiz.completed = true;
    quiz.completedAt = new Date();
    quiz.weakTopics = [...new Set(quiz.questions.filter((q,i) => userAnswers[i] !== q.correctAnswer).map(q => q.question.split(' ').slice(0,4).join(' ')))];
    quiz.analysis = quiz.percentage >= 80 ? 'Excellent performance! 🎉' : quiz.percentage >= 60 ? 'Good effort. Review weak areas.' : 'Needs more practice. Review fundamentals.';
    await quiz.save();

    const allQuizzes = await Quiz.find({ user: req.user._id, completed: true });
    const newAvg = allQuizzes.length ? Math.round(allQuizzes.reduce((s,q) => s + q.percentage, 0) / allQuizzes.length) : quiz.percentage;
    await Progress.findOneAndUpdate({ user: req.user._id }, { $set: { totalQuizzesTaken: allQuizzes.length, avgQuizScore: newAvg } }, { upsert: true });

    res.json({ success: true, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getQuizStats = async (req, res) => {
  try {
    if (memStore.isActive) {
      const quizzes = await memStore.getQuizzes(req.user._id, { completed: true });
      const avgScore = quizzes.length ? Math.round(quizzes.reduce((s,q) => s + (q.percentage||0), 0) / quizzes.length) : 0;
      const bySubject = {};
      quizzes.forEach(q => {
        if (!bySubject[q.subject]) bySubject[q.subject] = { total: 0, sum: 0 };
        bySubject[q.subject].total++;
        bySubject[q.subject].sum += q.percentage || 0;
      });
      const subjectStats = Object.entries(bySubject).map(([s,d]) => ({ subject: s, attempts: d.total, avgScore: Math.round(d.sum/d.total) }));
      return res.json({ success: true, totalQuizzes: quizzes.length, avgScore, subjectStats });
    }
    const quizzes = await Quiz.find({ user: req.user._id, completed: true });
    const avgScore = quizzes.length ? Math.round(quizzes.reduce((s,q) => s + q.percentage, 0) / quizzes.length) : 0;
    const bySubject = {};
    quizzes.forEach(q => {
      if (!bySubject[q.subject]) bySubject[q.subject] = { total: 0, sum: 0 };
      bySubject[q.subject].total++;
      bySubject[q.subject].sum += q.percentage;
    });
    const subjectStats = Object.entries(bySubject).map(([s,d]) => ({ subject: s, attempts: d.total, avgScore: Math.round(d.sum/d.total) }));
    res.json({ success: true, totalQuizzes: quizzes.length, avgScore, subjectStats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
