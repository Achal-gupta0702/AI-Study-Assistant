const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getNotes, getNote, createNote, updateNote, deleteNote, toggleFavorite } = require('../controllers/notesController');

router.get('/', protect, getNotes);
router.get('/:id', protect, getNote);
router.post('/', protect, createNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.patch('/:id/favorite', protect, toggleFavorite);

module.exports = router;
