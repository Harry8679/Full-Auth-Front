const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;