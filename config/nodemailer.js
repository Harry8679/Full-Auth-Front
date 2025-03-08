const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: 'ton-email@ton-domaine.com', // L'email vérifié dans SendGrid
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email envoyé avec succès !');
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
  }
};

module.exports = sendEmail;