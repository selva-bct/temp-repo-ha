// external package import
import 'babel-polyfill'

// const express = require('express')
import express from 'express'
import bodyParser from 'body-parser'
// import cors from 'cors'
const cors = require('cors')

// internal pakage code
import routes from './router'

const app = express()
const port = 4000

const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors(corsOptions))
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing
app.use('/api', routes)

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server :: ', err)
    return
  }
  console.log('Server started in port :: ', port)
})
