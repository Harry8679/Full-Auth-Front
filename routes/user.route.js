// routes/user.route.js
const express = require('express');
const router = express.Router();

// Exemple de route GET
router.get('/', async (req, res) => {
  res.send('This is a test');
});

module.exports = router; // Exporte le routeur