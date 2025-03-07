require('dotenv').config();
const transporter = require('./config/nodemailer');

const testMail = async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'destinataire@example.com', // Remplace par ton adresse de test
      subject: 'Test Nodemailer avec Outlook',
      text: 'Ceci est un test pour voir si Nodemailer fonctionne avec Outlook.',
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès !', result);
  } catch (err) {
    console.error('❌ Erreur envoi email:', err);
  }
};

testMail();