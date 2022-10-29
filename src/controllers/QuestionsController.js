const Question = require('../models/Question')

const QuestionsController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) - 1 || 0

      const limit = parseInt(req.query.limit) || 10

      const { search, sort } = req.query

      const filter = []

      if (search) filter.push({ title: { $regex: search.replace(/  +/g, ' ').trim().toLowerCase(), $options: 'i' } })
      

      if (sort) {
        filter.push({ $sort: { [sort]: 1 } })
      }

      const questions = await Question.find({ $and: filter }).sort(sort).skip(page * limit).limit(limit)

      const total = await Question.countDocuments({ $and: filter })

      const resopnse = {
        totalPage: Math.ceil(total / limit),
        currentPage: page + 1,
        questionCount: total,
        questions
      }

      res.status(200).json(resopnse)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  show: async (req, res) => {
    try {
      const { search } = req.query

      const questions = await Question.find({ title: { $regex: search.replace(/  +/g, ' ').trim().toLowerCase(), $options: 'i' } })

      const resopnse = { questions }

      res.status(200).json(resopnse)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  create: async (req, res) => {
    try {
      const { title, content, type, answer, trueAnswer, explaination, description } = req.body

      const question = await Question.findOne({ content })

      if (question) return res.status(400).json({ msg: 'This question already exists.' })

      const newQuestion = new Question({ title, content, type, answer, trueAnswer, explaination, description })

      await newQuestion.save()

      res.json({ newQuestion, msg: 'Question was created' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async (req, res) => {
    try {
      await Question.findByIdAndDelete(req.params.id)

      res.json({ msg: 'Question was Deleted' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async (req, res) => {
    try {
      const { title, content, type, answer, trueAnswer, explaination, description } = req.body

      await Question.findOneAndUpdate({ _id: req.params.id }, { title, content, type, answer, trueAnswer, explaination, description })

      res.json({ msg: 'Updated a question' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = QuestionsController
