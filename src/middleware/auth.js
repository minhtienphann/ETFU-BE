const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')
    const test = token.split(' ')[1]

    if (!test) return res.status(400).json({ msg: 'Invalid Authentication' })

    jwt.verify(test, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) { return res.status(400).json({ msg: `Invalid Authentication: ${test} ` + err.message }) }
      req.user = user
      next()
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}

module.exports = auth
