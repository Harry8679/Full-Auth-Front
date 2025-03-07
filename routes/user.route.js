// routes/user.route.js
const express = require('express');
const { register, login, verifyEmail, profile, updateProfile, forgotPassword, resetPassword } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

// Registration
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.get('/profile', authMiddleware, profile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports = router; // Exporte le routeur