const appRoutes = require('./appRoutes')
const {items} = require('./fakeDb')
process.env.NODE_ENV = "test"
const request = require('supertest')
const app = require('./app')

beforeEach(async () => {
    items.push({name: "Snickers", price: 1.2})
    items.push({name: "Twix", price: 1.4})
    items.push({name: "Mars", price: 1.3})
})
afterEach(async () => {
    items.length = 0
})

test('/items route should return the items in the db', async () => {
    r = await request(app).get('/items')
    expect(r.body).toEqual(items)
    expect(r.statusCode).toBe(200)
    expect(r.body).toHaveLength(3)
})

test('/items/:name get route should return the item from the db', async () => {
    r = await request(app).get('/items/Mars')
    expect(r.body.name).toEqual('Mars')
    expect(r.body.price).toEqual(1.3)
    expect(r.statusCode).toBe(200)
})

test('/items/:name get route should return error if name not in db', async () => {
    r = await request(app).get('/items/Bounty')
    expect(r.status).toEqual(400)
    expect(r.body.error.message).toEqual('this name does not exist')
})

test('post request to /items should add the item to db', async () => {
    const newItem = {name: "Skittles", price: 1.8}
    r = await request(app).post('/items').send(newItem)
    expect(r.statusCode).toBe(200);
    expect(r.body.added).toHaveProperty("name");
    expect(r.body.added).toHaveProperty("price");
    expect(r.body.added.name).toEqual("Skittles");
    expect(r.body.added.price).toEqual(1.8);
    expect(items.length).toEqual(4)
})

test('patch request to /items should modify data in the db', async () => {
    const modifyItem = {name: "Mars", price: 2.3}
    r = await request(app).patch('/items/Mars').send(modifyItem)
    expect(r.statusCode).toBe(200);
    expect(r.body.updated).toHaveProperty("name");
    expect(r.body.updated).toHaveProperty("price");
    expect(r.body.updated.name).toEqual("Mars");
    expect(r.body.updated.price).toEqual(2.3);
    expect(items[2].price).toEqual(2.3)
})

test("patch responds with error message if name doesn't exist in db", async () => {
    const modifyItem = {name: "Bounty", price: 2.3}
    r = await request(app).patch('/items/Bounty').send(modifyItem)
    expect(r.statusCode).toBe(400)
    expect(r.body.error.message).toEqual('You have not entered valid name or price or the name does not exist')
})

test("delete responds with error message if name doesn't exist in db", async () => {
    r = await request(app).delete('/items/Bounty')
    expect(r.statusCode).toBe(400)
    expect(r.body.error.message).toEqual('please enter a valid name')
})

test('delete request to /items/:name should delete data from db', async () => {
    r = await request(app).delete('/items/Mars')
    expect(r.statusCode).toBe(200)
    expect(items.length).toEqual(2)
    names = items.map((el)=>{
        return el.name
    })
    expect(names.indexOf('Mars')).toEqual(-1)
})

test('delete request should return a confirmation and a status code 200', async () => {
    r = await request(app).delete('/items/Twix')
    expect(r.statusCode).toBe(200)
    expect(r.body).toHaveProperty('message')
    expect(r.body.message).toEqual('deleted')
})
