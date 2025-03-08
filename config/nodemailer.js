const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // STARTTLS doit être activé
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  requireTLS: true, // Forcer l'utilisation de STARTTLS
  tls: {
    rejectUnauthorized: false, // Désactiver la vérification du certificat
  },
});

module.exports = transporter;