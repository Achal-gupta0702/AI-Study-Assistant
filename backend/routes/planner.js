const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getPlans, createPlan, addTask, updateTask, deleteTask } = require('../controllers/plannerController');

router.get('/', protect, getPlans);
router.post('/', protect, createPlan);
router.post('/:id/tasks', protect, addTask);
router.put('/:id/tasks/:taskId', protect, updateTask);
router.delete('/:id/tasks/:taskId', protect, deleteTask);

module.exports = router;
