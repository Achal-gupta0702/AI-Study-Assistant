const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getSubjects, getSubject, createSubject, updateSubject, deleteSubject, toggleTopic, addTopic } = require('../controllers/subjectsController');

router.get('/', protect, getSubjects);
router.get('/:id', protect, getSubject);
router.post('/', protect, createSubject);
router.put('/:id', protect, updateSubject);
router.delete('/:id', protect, deleteSubject);
router.patch('/:id/topics/:topicId/toggle', protect, toggleTopic);
router.post('/:id/topics', protect, addTopic);

module.exports = router;
