const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { chat, summarize, generateQuiz, generateFlashcards, getRecommendations } = require('../controllers/aiController');

router.post('/chat', protect, chat);
router.post('/summarize', protect, summarize);
router.post('/quiz', protect, generateQuiz);
router.post('/flashcards', protect, generateFlashcards);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
