const app = require('./app')

const port = process.env.PORT //server port or localhost port

app.listen(port, () => {
    console.log("listen on port " + port) //if success listen to port
})
