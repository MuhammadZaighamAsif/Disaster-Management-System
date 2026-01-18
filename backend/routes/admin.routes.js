const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyUser,
  deactivateUser,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require ADMIN role
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/deactivate', deactivateUser);

module.exports = router;
