const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sendEmail = require('../config/nodemailer'); // Assurez-vous que sendEmail est bien exporté

dotenv.config();

// ✅ Inscription avec envoi de mail
const register = async (req, res) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Génération du token pour vérifier l'email
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // ✅ Affichage du token dans la console pour le récupérer facilement
    console.log("Token de vérification:", token);

    // ✅ Modifier l'envoi de l'email avec SendGrid
    await sendEmail(
      email,
      'Confirmez votre email',
      `Cliquez sur ce lien pour activer votre compte : ${process.env.CLIENT}/verify-email/${token}`
    );

    // ✅ Sauvegarde de l'utilisateur uniquement après l'envoi de l'email
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Utilisateur créé. Un mail vous a été envoyé.' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};


// ✅ Vérification de l'email (changement de isVerified: false -> true)
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Mettre à jour isVerified à true
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé ou déjà vérifié.' });
    }

    res.status(200).json({ message: 'Email vérifié avec succès !' });
  } catch (err) {
    res.status(400).json({ error: 'Lien invalide ou expiré' });
  }
};

// ✅ Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Identifiants incorrects' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: 'Veuillez vérifier votre email avant de vous connecter.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 ✅ Profil utilisateur (Get Profile)
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 ✅ Mise à jour du profil
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.user.id, { name, email });
    res.json({ message: 'Profil mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 ✅ Mot de passe oublié
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.resetToken = token;
    await user.save();

    await sendEmail(
      email,
      'Réinitialisation du mot de passe',
      `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${process.env.CLIENT_URL}/reset-password/${token}`
    );

    res.json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 ✅ Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, resetToken: token });
    if (!user) return res.status(400).json({ error: 'Token invalide ou expiré' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await user.save();
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 ✅ Export des contrôleurs
module.exports = {
  register,
  verifyEmail,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
};