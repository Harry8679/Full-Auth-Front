const express = require('express');
const {
  register,
  login,
  verifyEmail,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// 📌 ✅ Route pour l'inscription
router.post('/register', register);

// 📌 ✅ Route pour la connexion
router.post('/login', login);

// 📌 ✅ Route pour la vérification de l'email (mise à jour avec `PUT`)
router.get('/verify-email/:token', verifyEmail);  // 🔥 Correctement mis en PUT !

// 📌 ✅ Routes pour gérer le profil utilisateur
router.get('/profile', authMiddleware, profile);
router.put('/profile', authMiddleware, updateProfile);

// 📌 ✅ Routes pour la récupération de mot de passe
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', changePassword);

module.exports = router;
