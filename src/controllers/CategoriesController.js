const Category = require('../models/Category')
const Test = require('../models/Test')

const CategoriesController = {
  show: async (req, res) => {
    try {
      const categories = await Category.find().lean().exec()
      res.json(categories)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  create: async (req, res) => {
    try {
      const { name } = req.body

      const category = await Category.findOne({ name })

      if (category) return res.status(400).json({ msg: 'This category already exists.' })

      const newCategory = new Category({ name })

      await newCategory.save()

      res.json({ msg: 'Created a category' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async (req, res) => {
    try {
      const tests = await Test.findOne({ category: req.params.id })

      if (tests) {
        return res.status(400).json({
          msg: 'Please delete all Test before delete category'
        })
      }
      await Category.findByIdAndDelete(req.params.id)

      res.json({ msg: 'Category was Deleted' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async (req, res) => {
    try {
      const { name } = req.body

      await Test.findOneAndUpdate(
        { _id: req.params.id },
        { name }
      )

      res.json({ msg: 'Test was Updated' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }

}

module.exports = CategoriesController
