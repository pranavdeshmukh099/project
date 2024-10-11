const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean,
  category: String,
  // Add other fields as required
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
