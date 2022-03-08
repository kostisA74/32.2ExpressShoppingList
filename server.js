const express = require('express')
const app = require('./app')

app.listen(3000,(req,res) => {
    console.log('App on port 3000')
})