const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const taskRouter = new express.Router()

// for tasks
//delete task

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Update task

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']
    const valid = updates.every((update) => {
        return validUpdates.includes(update)
    })
    if (!valid)
        return res.status(400).send('not valid operation')
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) return res.status(404).send()
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
//create task
taskRouter.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const ttask = await task.save()
        res.status(201).send(ttask)
    } catch (e) {
        res.status(400).send(e)
    }
})

//fetch all tasks =>GET /tasks/?completed=true //filter
//tasks?limit=count_num&skip=num_to_skip  //pagination
//tasks?sortBy=createdAt:desc
taskRouter.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort={}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'

    }
    if (req.query.sortBy) {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

//fetch single task by id
taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const task_id = req.params.id
    const user_id = req.user._id
    try {
        const task = await Task.findOne({ _id: task_id, owner: user_id })
        if (!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = taskRouter
