const express = require('express');
const router = express.Router();
const {
  getDisasters,
  getDisaster,
  searchDisasters,
  reportDisaster,
  addDisaster,
  updateDisaster,
  deleteDisaster,
  verifyDisaster,
  rejectDisaster,
} = require('../controllers/disaster.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getDisasters);
router.get('/search', searchDisasters);
router.get('/:id', getDisaster);

// Private routes (authenticated users)
router.post('/report', protect, reportDisaster);

// Admin routes
router.post('/', protect, authorize('ADMIN'), addDisaster);
router.put('/:id', protect, authorize('ADMIN'), updateDisaster);
router.delete('/:id', protect, authorize('ADMIN'), deleteDisaster);
router.put('/:id/verify', protect, authorize('ADMIN'), verifyDisaster);
router.put('/:id/reject', protect, authorize('ADMIN'), rejectDisaster);

module.exports = router;
