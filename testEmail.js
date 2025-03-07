require('dotenv').config();
const transporter = require('./config/nodemailer'); // Assure-toi que le chemin est correct

const testMail = async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'xavi.lamachine@gmail.com', // Remplace par ton adresse email de test
      subject: 'Test Nodemailer',
      text: 'Ceci est un test pour voir si Nodemailer fonctionne correctement.',
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès !', result);
  } catch (err) {
    console.error('❌ Erreur envoi email:', err);
  }
};

testMail();