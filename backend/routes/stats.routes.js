const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/stats.controller');

// Public route - no authentication required
router.get('/', getStats);

module.exports = router;
