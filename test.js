#!/usr/bin/env node

'use strict'

const express = require('express')

const db = require('./app/db')
const config = require('./app/config')
const { send } = require('./app/api')

const app = express()

app.set('trust proxy', 1)

app.use(config.root + 'api', require('./app/routes/api'))

app.use((req, res) => send(res, 404, { message: 'Route not found' }))

db
  .sync()
  .then(() => app.listen(config.port, err => {
    if (err) {
      console.error(`Server listen failed : ${err}`)
    } else {
      console.info(`Server listening on port ${config.port}. http://localhost:${config.port}${config.root}`)
    }
  }))

module.exports = app
