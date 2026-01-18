const express = require('express');
const router = express.Router();
const {
  createAidRequest,
  getMyAidRequests,
  getPendingAidRequests,
  getAllAidRequests,
  approveAidRequest,
  rejectAidRequest,
  updateAidRequestStatus,
} = require('../controllers/aidRequest.controller');
const { protect, authorize } = require('../middleware/auth');

// Victim routes
router.post('/', protect, authorize('VICTIM'), createAidRequest);
router.get('/my-requests', protect, authorize('VICTIM'), getMyAidRequests);

// Admin routes
router.get('/pending', protect, authorize('ADMIN'), getPendingAidRequests);
router.get('/', protect, authorize('ADMIN'), getAllAidRequests);
router.put('/:id/approve', protect, authorize('ADMIN'), approveAidRequest);
router.put('/:id/reject', protect, authorize('ADMIN'), rejectAidRequest);
router.put('/:id/status', protect, authorize('ADMIN'), updateAidRequestStatus);

module.exports = router;
