const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const userRouter = new express.Router()
const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('file must be jpg,jpeg or png'))
        }
        cb(undefined, true)

    }
})

//delete user avatar
userRouter.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(401).send()
    }

})

//upload user avatar
userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


//get  user avatar
userRouter.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})
//fetching all users
userRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

//fetch user by id
userRouter.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()
        res.send(user)

    } catch (e) {
        res.status(500).send(e)
    }

})
//create user
userRouter.post('/users', async (req, res) => {  //for post http method
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

})

//update user
userRouter.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'age', 'password', 'email']
    const valid = updates.every((update) => {
        return validUpdates.includes(update)
    })
    if (!valid)
        return res.status(400).send('not valid operation')
    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete user
userRouter.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(401).send()
    }
})

userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.loginWithCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})
userRouter.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
userRouter.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = userRouter