const express = require('express');
const router = express.Router();
const {
  getAvailableTasks,
  getMyTasks,
  assignTask,
  updateTaskStatus,
  getAllVolunteers,
  createTask,
  getAllTasks,
  updateVolunteerProfile,
} = require('../controllers/volunteer.controller');
const { protect, authorize } = require('../middleware/auth');

// Volunteer routes
router.get('/tasks/available', protect, authorize('VOLUNTEER'), getAvailableTasks);
router.get('/my-tasks', protect, authorize('VOLUNTEER'), getMyTasks);
router.post('/tasks/:id/assign', protect, authorize('VOLUNTEER'), assignTask);
router.put('/tasks/:id/status', protect, authorize('VOLUNTEER', 'ADMIN'), updateTaskStatus);
router.put('/profile', protect, authorize('VOLUNTEER'), updateVolunteerProfile);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllVolunteers);
router.post('/tasks', protect, authorize('ADMIN'), createTask);
router.get('/tasks', protect, authorize('ADMIN'), getAllTasks);

module.exports = router;
