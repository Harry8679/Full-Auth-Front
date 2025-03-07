// routes/user.route.js
const express = require('express');
const { register, login, verifyEmail, profile, updateProfile, forgotPassword } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

// Registration
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/profile', authMiddleware, profile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/forgot-password', forgotPassword);


module.exports = router; // Exporte le routeur