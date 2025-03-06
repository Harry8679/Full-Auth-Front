// routes/user.route.js
const express = require('express');
const { register, login, verifyEmail } = require('../controllers/user.controller');
const router = express.Router();

// Registration
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);

module.exports = router; // Exporte le routeur