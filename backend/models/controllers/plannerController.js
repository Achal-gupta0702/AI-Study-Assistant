const memStore = require('../memStore');
let StudyPlan;
try { StudyPlan = require('../models/StudyPlan'); } catch(e) {}

exports.getPlans = async (req, res) => {
  try {
    if (memStore.isActive) {
      const plans = await memStore.getPlans(req.user._id);
      return res.json({ success: true, plans });
    }
    const plans = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, plans });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPlan = async (req, res) => {
  try {
    if (memStore.isActive) {
      const tasks = req.body.tasks || [];
      const plan = await memStore.createPlan({ ...req.body, user: req.user._id, totalTasks: tasks.length, completedTasks: 0 });
      return res.status(201).json({ success: true, plan });
    }
    const plan = await StudyPlan.create({ ...req.body, user: req.user._id, totalTasks: req.body.tasks?.length || 0 });
    res.status(201).json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addTask = async (req, res) => {
  try {
    if (memStore.isActive) {
      const plan = await memStore.getPlan(req.params.id);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const tasks = [...(plan.tasks || []), { ...req.body, _id: taskId, completed: false }];
      const updated = await memStore.updatePlan(req.params.id, { tasks, totalTasks: tasks.length });
      return res.json({ success: true, plan: updated });
    }
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    plan.tasks.push(req.body);
    plan.totalTasks = plan.tasks.length;
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    if (memStore.isActive) {
      const plan = await memStore.getPlan(req.params.id);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      const tasks = (plan.tasks || []).map(t => {
        if (String(t._id) === String(req.params.taskId)) {
          const updated = { ...t, ...req.body };
          if (req.body.completed && !t.completedAt) updated.completedAt = new Date();
          return updated;
        }
        return t;
      });
      const completedTasks = tasks.filter(t => t.completed).length;
      const updated = await memStore.updatePlan(req.params.id, { tasks, completedTasks });
      return res.json({ success: true, plan: updated });
    }
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    const task = plan.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    Object.assign(task, req.body);
    if (req.body.completed && !task.completedAt) task.completedAt = new Date();
    plan.completedTasks = plan.tasks.filter(t => t.completed).length;
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    if (memStore.isActive) {
      const plan = await memStore.getPlan(req.params.id);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      const tasks = (plan.tasks || []).filter(t => String(t._id) !== String(req.params.taskId));
      const updated = await memStore.updatePlan(req.params.id, { tasks, totalTasks: tasks.length });
      return res.json({ success: true, plan: updated });
    }
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    plan.tasks.pull({ _id: req.params.taskId });
    plan.totalTasks = plan.tasks.length;
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
