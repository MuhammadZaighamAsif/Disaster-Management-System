const express = require('express');
const router = express.Router();
const {
  getAllVictims,
  getVictim,
} = require('../controllers/victim.controller');
const { protect, authorize } = require('../middleware/auth');

// All victim routes are admin-only
router.get('/', protect, authorize('ADMIN'), getAllVictims);
router.get('/:id', protect, authorize('ADMIN'), getVictim);

module.exports = router;
