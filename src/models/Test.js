const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Test = new Schema({
  title: {
    type: String,
    required: true
  },
  content: [],
  description: {
    type: String
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  video: {
    type: String
  },
  image: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Test', Test)
