const express = require('express')
const router = new express.Router()
const ExpressError = require('./expressError')
const { items } = require('./fakeDb')

router.get('/', (req, res) => {
    return res.json(items)    
})

router.get('/:name', (req,res,next) => {
    const r = req.params.name
    names = items.map((el)=>{
        return el.name
    })
    try {
        if (!r || names.indexOf(r) === -1){
            throw new ExpressError('this name does not exist', 400)
        }
    } catch (error) {
        return next(error)
    }
    return res.json(items[names.indexOf(r)])
})

router.post('/', (req, res, next) => {
    const r = req.body
    try {
        if (!r.name || !r.price){
            throw new ExpressError('name & price is needed', 400)
        }else if (isNaN(parseFloat(r.price))){
            throw new ExpressError('please enter a valid number for price', 400)
        }
    } catch (error) {
        return next(error)
    }
    const item = {}
    item['name'] = r.name
    item['price'] = parseFloat(r.price)
    items.push(item)
    return res.json({added: item})
})

router.patch('/:name', (req,res,next) => {
    const r = req.body
    names = items.map((el)=>{
        return el.name
    })
    try {
        if (!r.name || !r.price || names.indexOf(r.name) === -1){
            throw new ExpressError('You have not entered valid name or price or the name does not exist', 400)
        }else if (isNaN(parseFloat(r.price))){
            throw new ExpressError('please enter a valid number for price', 400)
        }
    } catch (error) {
        return next(error)
    }
    for (let item of items) {
        if (item['name'] === r.name){
            item['price'] = parseFloat(r.price)
            return res.json({updated: item})
        }
    }
})

router.delete('/:name', (req, res, next) => {
    const r = req.params
    names = items.map((el)=>{
        return el.name
    })
    try {
        if (!r.name || names.indexOf(r.name) === -1) {
            throw new ExpressError('please enter a valid name', 400)
        }
    } catch (error) {
        return next(error)
    }
    for (let i in items) {
        if (items[i]['name'] === r.name){
            items.splice(i,1)
            return res.json({message: 'deleted'})
        }
    }
})

module.exports = router