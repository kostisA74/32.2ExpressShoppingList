const express = require('express')
const res = require('express/lib/response')
const {items} = require('./fakeDb')
const app = express()

const appRoutes = require('./appRoutes')

app.use(express.json());
app.use('/items', appRoutes)

app.use((error, req,res,next) => {
    let status = error.status || 500;
  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: error.message,
      status: status
    }
  });
})

module.exports = app

