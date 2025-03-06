// routes/user.route.js
const express = require('express');
const { register } = require('../controllers/user.controller');
const router = express.Router();

// Registration
router.post('/', register);

module.exports = router; // Exporte le routeur