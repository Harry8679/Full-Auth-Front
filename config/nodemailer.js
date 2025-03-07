const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // Serveur SMTP pour les comptes personnels
  port: 587, // Port SMTP
  secure: false, // Doit être false, car on utilise STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Ton email Outlook
    pass: process.env.EMAIL_PASS, // Ton mot de passe Outlook (ou mot de passe d’application)
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;