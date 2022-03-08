const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    return res.json(items)    
})

router.post('/', (req, res) => {
    const r = req.query
    const item = {}
    item['name'] = r.name
    item['price'] = parseFloat(r.price)
    items.push(item)
    return res.json({added: item})
})

router.patch('/', (req,res) => {
    const r = req.query
    for (let item of items) {
        if (item['name'] === r.name){
            item['price'] = parseFloat(r.price)
            return res.json({updated: item})
        }
    }
})

router.delete(':name', (req, res) => {
    const r = req.params
    console.log(r)
    for (let i in items) {
        if (items[i]['name'] === r.name){
            console.log(i)
            console.log(items[i])
            items.splice(i,1)
            return res.json({message: 'deleted'})
        }
    }
})

module.exports = router