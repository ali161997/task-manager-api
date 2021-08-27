const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/User')
const Task = require('../../src/models/Task');
const userId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const user = {
    _id: userId,
    name: 'ahmed adel',
    email: 'ahmedadel@gmail.com',
    password: 'Asd1234#',
    tokens: [
        {
            token: jwt.sign({ _id: userId }, process.env.JWT_SECRET)

        }
    ]

}
const userTwo = {
    _id: userTwoId,
    name: 'ahmed hashem',
    email: 'ahmedhashem@example.com',
    password: 'Asd1234#',
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)

        }
    ]

}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userId
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userId
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'third Task',
    completed: false,
    owner: userTwoId
}




const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

}

module.exports = {
    setupDatabase,
    userId,
    user
}