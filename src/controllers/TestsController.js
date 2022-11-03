const Test = require('../models/Test')
const { Types } = require('mongoose')

const TestsController = {
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

      const tests = await Test.find({ $and: filter }).sort(sort).skip(page * limit).limit(limit)

      const total = await Test.countDocuments({ $and: filter })

      const resopnse = {
        totalPage: Math.ceil(total / limit),
        currentPage: page + 1,
        testCount: total,
        tests
      }

      res.status(200).json(resopnse)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  show: async (req, res) => {
    try {
      const page = parseInt(req.query.page) - 1 || 0

      const limit = parseInt(req.query.limit) || 6

      const { category, search, sort, choice } = req.query

      const filter = []

      if (!category) return

      if (category) filter.push({ $match: { category: new Types.ObjectId(category) } })

      if (search) filter[0].$match.title = { $regex: search.replace(/  +/g, ' ').trim().toLowerCase(), $options: 'i' }

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

      if (choice) filter.push({ $match: { 'questions.type': choice } })

      if (sort) {
        filter.push({ $sort: { [sort]: 1 } })
      }

      filter.push({ $project: { category: 0 } })

      const tests = await Test.aggregate(filter).sort(sort).skip(page * limit).limit(limit)

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
        testCount: total,
        tests
      }

      res.status(200).json(resopnse)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  create: async (req, res) => {
    try {
      const { title, content, description, questions, category, video } = req.body

      const image = { name: 'http://localhost:3000/' + req.file.filename }

      if (!image) return res.status(400).json({ msg: 'No image upload' })

      const test = await Test.findOne({ title })

      if (test) { return res.status(400).json({ msg: 'This test already exists.' }) }
      const newTest = new Test({
        title,
        content,
        description,
        questions,
        category,
        image,
        video
      })

      await newTest.save()

      res.json({ newTest, msg: 'Test was Created' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async (req, res) => {
    try {
      await Test.findByIdAndDelete(req.params.id)

      res.json({ msg: 'Test was Deleted' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async (req, res) => {
    try {
      const { title, content, description, questions, category } = req.body

      const image = { name: 'http://localhost:3000/' + req.file.filename }

      await Test.findOneAndUpdate({ _id: req.params.id }, {
        title,
        content,
        description,
        questions,
        category,                                                                                                                                               
        image
      }).populate('category').populate('questions') 

      res.json({ msg: 'Test was Updated' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
}

module.exports = TestsController
