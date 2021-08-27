const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')

const { setupDatabase,
    userId,
    user } = require('../tests/fixtures/db')


const noUser = {
    name: 'kareem',
    email: 'kareem@gmail.com',
    password: 'Asd1234#'

}

beforeEach(setupDatabase)

test('should signup new user', async () => {
    const res = await request(app).post('/users').send({
        name: "ali hashem",
        email: "ali@example.com",
        password: "Mypass12345!"

    }).expect(201)

    //assertion database changes successfully
    const us = await User.findById(res.body.user._id)
    expect(us).not.toBeNull()

    //Assertion about the respnse
    expect(res.body).toMatchObject({
        user: {
            name: "ali hashem",
            email: "ali@example.com"
        },
        token: us.tokens[0].token
    })
    expect(us.password).not.toBe('Mypass12345!')
})

test('should login user', async () => {
    const response = await request(app).post('/users/login').send({
        email: user.email,
        password: user.password
    }).expect(200)
    const user1 = await User.findById(userId)
    expect(response.body.token).toBe(user1.tokens[1].token)

})
test('should not login non exist user', async () => {
    await request(app).post('/users/login').send({
        email: noUser.email,
        password: noUser.password
    }).expect(400)
})

test('should not get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
test('should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send()
        .expect(200)
    const user1 = await User.findById(userId);
    expect(user1).toBeNull()
})

test('should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


// test('should avatar image', async () => {
//     await request(app)
//         .post('/users/me/avatar')
//         .set('Authorization', `Bearer ${user.tokens[0].token}`)
//         .attach('avatar', 'tests/fixtures/image.jpg')
//         .expect(200)

//     const user1 = await User.findById(userId)
//     expect(user1.avatar).toEqual(expect.any(Buffer))
// })

test('should update user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            name: 'khaled'
        })
        .expect(200)

    const user1 = await User.findById(userId)
    expect(user1.name).toEqual('khaled')
})
test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            location: 'cairo'
        })
        .expect(400)
})