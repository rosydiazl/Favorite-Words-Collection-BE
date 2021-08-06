const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  definition: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  sentence: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Word', wordSchema)
