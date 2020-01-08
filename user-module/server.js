// external package import
import 'babel-polyfill'

// const express = require('express')
import express from 'express'
import bodyParser from 'body-parser'
// const bodyParser = require('body-parser')

// internal pakage code
import routes from './router'

const app = express()
const port = 3000

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing
app.use(routes)

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server :: ', err)
    return
  }
  console.log('Server started in port :: ', port)
})
