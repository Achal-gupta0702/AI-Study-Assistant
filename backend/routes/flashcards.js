const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getSets, getSet, createSet, updateCard, deleteSet } = require('../controllers/flashcardsController');

router.get('/', protect, getSets);
router.get('/:id', protect, getSet);
router.post('/', protect, createSet);
router.patch('/:id/card', protect, updateCard);
router.delete('/:id', protect, deleteSet);

module.exports = router;
