const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // Serveur SMTP Outlook
  port: 587, // Port standard pour Outlook SMTP
  secure: false, // STARTTLS doit être activé
  auth: {
    user: process.env.EMAIL_USER, // Ton email Outlook
    pass: process.env.EMAIL_PASS, // Ton mot de passe d'application
  },
  tls: {
    rejectUnauthorized: false, // Évite certains problèmes SSL
  },
});

module.exports = transporter;