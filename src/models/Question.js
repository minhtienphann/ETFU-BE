const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Question = new Schema({
  title: {
    type: String,
    required: true
  },
  content: [],
  type: {
    type: String,
    required: true,
    enum: ['fillblank', 'multiplechoice']
  },
  answer: [],
  trueAnswer: {
    type: String,
    required: true
  },
  explaination: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Question', Question)
