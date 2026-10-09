const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getMe, updateProfile } = require('../controllers/authController');

router.get('/', protect, getMe);
router.put('/', protect, updateProfile);

module.exports = router;
