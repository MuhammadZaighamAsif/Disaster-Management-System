const express = require('express');
const router = express.Router();
const {
  getAllDonors,
  verifyDonor,
  unverifyDonor,
} = require('../controllers/donor.controller');
const { protect, authorize } = require('../middleware/auth');

// All donor routes are admin-only
router.get('/', protect, authorize('ADMIN'), getAllDonors);
router.put('/:id/verify', protect, authorize('ADMIN'), verifyDonor);
router.put('/:id/unverify', protect, authorize('ADMIN'), unverifyDonor);

module.exports = router;
