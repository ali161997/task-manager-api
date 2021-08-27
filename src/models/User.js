const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./Task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v))
                throw new Error('Email is invalid')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(v) {
            if (v < 0)
                throw new Error('error !age must be greater than 0 ')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(v) {
            if (v.toLowerCase().includes('password')) {
                throw new Error('you must not include "password" in your pass')
            }
        }

    },
    avatar: {
        type: Buffer
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]


}, {
    timestamps: true
})
userSchema.virtual('tasks',
    {
        ref: 'Task',
        localField: '_id',
        foreignField: 'owner'
    }
)
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
//login with credintial
userSchema.statics.loginWithCredential = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('no User found')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('error password')
    return user
}
//hash password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})
userSchema.pre('remove', async function (req, res, next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()

})
const User = mongoose.model('User', userSchema)
module.exports = User
