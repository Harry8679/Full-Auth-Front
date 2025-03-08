const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');
const dotenv = require('dotenv');
const sendEmail = require('../config/nodemailer');

dotenv.config();

// Registration
// 📌 ✅ Correction de register
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

    // 📌 ✅ Génération du token pour vérifier l'email
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 📌 ✅ Modifier l'envoi de l'email avec SendGrid
    await sendEmail(
      email,
      'Confirmez votre email',
      `Cliquez sur ce lien pour activer votre compte : ${process.env.CLIENT}/verify/${token}`
    );

    // 📌 ✅ Sauvegarder l'utilisateur seulement si l'email a bien été envoyé
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

module.exports = { register };


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

// Show the profile
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.user.id, { name, email });
    res.json({ message: 'Profil mis à jour' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

const verifyEmail = async(req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });

    if (user.isVerified) {
      return res.status(400).json({ error: 'Compte déjà vérifié' });
    }
    user.isVerified = true;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch(err) {
    res.status(400).json({ error: 'Lien invalide ou expiré' })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });
   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.resetToken = token;
    await user.save();
   
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `<p>Cliquez <a href="${process.env.CLIENT_URL}/reset-password/${token}">ici</a> pour réinitialiser votre mot de passe.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
  } catch(err) {
    res.send(500).json({ error: err.message });
  }
}

module.exports = { register, login, verifyEmail, profile, updateProfile, forgotPassword, resetPassword };