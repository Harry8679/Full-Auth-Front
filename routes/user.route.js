// routes/user.route.js
const express = require('express');
const { register } = require('../controllers/user.controller');
const router = express.Router();

// Exemple de route GET
router.post('/', register);

module.exports = router; // Exporte le routeur