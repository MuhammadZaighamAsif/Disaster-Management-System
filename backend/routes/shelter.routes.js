const express = require('express');
const router = express.Router();
const {
  offerShelter,
  getAvailableShelters,
  getMyShelters,
  getAllShelters,
  updateShelter,
  updateShelterOccupancy,
  deleteShelter,
} = require('../controllers/shelter.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public/Victim routes
router.get('/available', optionalAuth, getAvailableShelters);

// Donor routes
router.post('/', protect, authorize('DONOR'), offerShelter);
router.get('/my-shelters', protect, authorize('DONOR'), getMyShelters);
router.put('/:id', protect, authorize('DONOR', 'ADMIN'), updateShelter);
router.delete('/:id', protect, authorize('DONOR', 'ADMIN'), deleteShelter);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllShelters);
router.put('/:id/occupancy', protect, authorize('ADMIN'), updateShelterOccupancy);

module.exports = router;
