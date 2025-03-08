require('dotenv').config();
const sendEmail = require('./config/sendgrid'); // Importer la fonction SendGrid

const testMail = async () => {
  try {
    await sendEmail(
      'destinataire@example.com', // 🔹 Remplace par ton adresse de test
      'Test SendGrid',
      'Ceci est un test pour voir si SendGrid fonctionne correctement.'
    );
    console.log('✅ Email envoyé avec succès !');
  } catch (err) {
    console.error('❌ Erreur envoi email:', err);
  }
};

testMail();