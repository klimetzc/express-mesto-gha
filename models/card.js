const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    required: true,
    type: String,
  },

  owner: {
    required: true,
    type: mongoose.Types.ObjectId,
  },

  likes: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
