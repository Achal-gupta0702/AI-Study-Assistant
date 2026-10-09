const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getQuizzes, createQuiz, submitQuiz, getQuizStats } = require('../controllers/quizController');

router.get('/', protect, getQuizzes);
router.get('/stats', protect, getQuizStats);
router.post('/', protect, createQuiz);
router.put('/:id/submit', protect, submitQuiz);

module.exports = router;
