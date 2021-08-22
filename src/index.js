const express = require('express')
require('./db/mongoose.js')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()  //initialize express

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


const port = process.env.PORT //if server port or localhost port
app.listen(port, () => {
    console.log("listen on port " + port) //if success listen to port
})