const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Ad = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // to change this relation from one to many just wrap it with an array
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sold: {
    type: String,
    required: true,
    default: false,
  },
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Ad.plugin(mongoosePaginate);

module.exports = mongoose.model('Ad', Ad);
