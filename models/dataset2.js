const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  product: String,
  price: Number,
  views: Number,
  sales: Number,
  date: Date
});

module.exports = mongoose.model('dataset2', userSchema);
