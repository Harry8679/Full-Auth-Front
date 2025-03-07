const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // Pour les comptes Outlook
  port: 587, // Utilisation du port SMTP standard
  secure: false, // Doit être false pour STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Ton email Outlook
    pass: process.env.EMAIL_PASS, // Ton mot de passe d'application
  },
  tls: {
    rejectUnauthorized: false, // Évite certains problèmes SSL
  },
});

module.exports = transporter;