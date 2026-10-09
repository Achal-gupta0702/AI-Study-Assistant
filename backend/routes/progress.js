const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getProgress, logStudySession, getAnalytics } = require('../controllers/progressController');

router.get('/', protect, getProgress);
router.post('/log', protect, logStudySession);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
