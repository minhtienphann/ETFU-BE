const { Types } = require('mongoose')
const Test = require('../models/Test')
const Exam = require('../models/Exam')
const User = require('../models/User')

const ExamsController = {
  show: async (req, res) => {
    try {
      const page = parseInt(req.query.page) - 1 || 0

      const limit = parseInt(req.query.limit) || 3

      const { category } = req.query

      const filter = []

      if (!category) return

      if (category) { filter.push({ $match: { category: new Types.ObjectId(category) } }) }

      filter.push({
        $lookup: {
          from: 'questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questions'
        }
      })

      filter.push({
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      })

      filter.push({
        $sample: { size: 3 }
      })
      filter.push({ $project: { category: 0 } })

      const exams = await Test.aggregate(filter)
        .skip(page * limit)
        .limit(limit)

      filter.push({
        $group: {
          _id: null,
          count: {
            $sum: 1
          }
        }
      })
      const total = (await Test.aggregate(filter))[0]?.count

      const resopnse = {
        totalPage: Math.ceil(total / limit),
        currentPage: page + 1,
        examCount: total,
        exams
      }

      res.status(200).json(resopnse)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  submit: async (req, res) => {
    try {
      const { time, score, category } = req.body

      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(400).send('User not found')
      }

      const newExam = new Exam({ user: req.user.id, time, score, category })

      await newExam.save()

      res.json({ newExam, msg: 'Exam was submit' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = ExamsController
