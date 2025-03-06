const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
// const { transporter } = require('../config/nodemailer');
const transporter = require('../config/nodemailer');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmez votre email',
      html: `<p>Cliquez <a href="${process.env.CLIENT}/verify/${token}">ici</a> pour activer votre compte</p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Utilisateur créé. Un mail vous a été envoyé.' })
  } catch(err) {
    res.status(500).json({ error: error.message });
  }
}

const login = async (req, res) => {
  res.send('Login')
}

module.exports = { register, login };