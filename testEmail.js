const sendEmail = require('./config/nodemailer');

require('dotenv').config();

const testMail = async () => {
  try {
    await sendEmail(
      'xavi.lamachine@gmail.com', // 🔹 Remplace par ton adresse de test
      'Test SendGrid',
      'Ceci est un test pour voir si SendGrid fonctionne correctement.'
    );
    console.log('✅ Email envoyé avec succès !');
  } catch (err) {
    console.error('❌ Erreur envoi email:', err);
  }
};

testMail();