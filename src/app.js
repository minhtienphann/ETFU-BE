const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const db = require('./config/connect')
const route = require('./routes')
const dotenv = require('dotenv')
const port = 3000
const cors = require('cors')
const path = require('path')

dotenv.config()

db.connect()

app.use(cors({ origin: true }))

app.use(morgan('combined'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.static(path.join(__dirname, 'uploads')))

app.use(express.json())

route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
