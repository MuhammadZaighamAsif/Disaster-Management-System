const express = require('express');
const router = express.Router();
const {
  donateMoney,
  donateItems,
  getMyDonations,
  getAllDonations,
  verifyDonation,
  rejectDonation,
} = require('../controllers/donation.controller');
const { protect, authorize } = require('../middleware/auth');

// Donor routes
router.post('/money', protect, authorize('DONOR'), donateMoney);
router.post('/items', protect, authorize('DONOR'), donateItems);
router.get('/my-donations', protect, authorize('DONOR'), getMyDonations);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllDonations);
router.put('/:id/verify', protect, authorize('ADMIN'), verifyDonation);
router.put('/:id/reject', protect, authorize('ADMIN'), rejectDonation);

module.exports = router;
