const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  email: {
    type: String,
    required: true
},
  password: String
},
{timestamps: true});

module.exports = mongoose.model('User', userSchema);