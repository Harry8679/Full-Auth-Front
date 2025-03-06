const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Configuration de Nodemailer


  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server launched on the port ${PORT}`));