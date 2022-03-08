const express = require('express')
const res = require('express/lib/response')
const {items} = require('./fakeDb')
const app = express()

const appRoutes = require('./appRoutes')

app.use('/items', appRoutes)

module.exports = app

