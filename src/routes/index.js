const categoriesRouter = require('./categories')
const questionsRouter = require('./questions')
const usersRouter = require('./users')
const testsRouter = require('./tests')
const examsRouter = require('./exams')
const postsRouter = require('./post')

function route (app) {
  app.use('/api/categories', categoriesRouter)
  app.use('/api/questions', questionsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/tests', testsRouter)
  app.use('/api/exams', examsRouter)
  app.use('/api/posts', postsRouter)
}
module.exports = route
