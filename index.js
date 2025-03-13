const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 3000
const cores = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
const app = express()
const authRoute = require('./routes/authRoute')
// using meddleware
app.use(express.json())
app.use(cores())
app.use(helmet())
app.use(cookieParser()) 
app.use(express.urlencoded({ extended: true }))
// connect to database
mongoose.connect(process.env.MONGOOS_URL).then(() => {
    console.log('Connected to databasehhg')
 }).catch((err) => {
    console.log('Error connecting to database',err)
 })
app.use('/api',authRoute)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})