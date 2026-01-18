const express = require('express');
const router = express.Router();
const { signup, login, getMe, logout, verifyToken, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);
router.get('/verify', protect, verifyToken);

module.exports = router;
