// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNum: { type: String, required: true, unique: true },
  availableAmount: { type: Number, default: 0 },
  transactions: [
    {
      from: String,
      to: String,
      amount: Number,
      cashback: Number
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
