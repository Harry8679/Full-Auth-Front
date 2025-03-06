// routes/user.route.js
const express = require('express');
const { register, login } = require('../controllers/user.controller');
const router = express.Router();

// Registration
router.post('/register', register);
router.post('/login', login);

module.exports = router; // Exporte le routeur