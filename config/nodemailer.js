const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // Doit être false car on utilise STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Ton email Outlook
    pass: process.env.EMAIL_PASS, // Ton mot de passe Outlook (ou mot de passe d'application)
  },
  tls: {
    ciphers: 'SSLv3',
  }
});

module.exports = transporter;