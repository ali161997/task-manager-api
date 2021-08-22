require('../src/db/mongoose.js')
const Task = require('../src/models/Task')

const id = '6118b0a3c354d11eb8937174'
// Task.findByIdAndRemove(id).then((obj) => {
//     console.log(obj)
//     return Task.countDocuments({ completed: false })
// }).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

const removeAndCount = async (id, status) => {
    const remove = await Task.findByIdAndRemove(id)
    const count = await Task.countDocuments({ completed: status })
    return { remove, count }

}
removeAndCount(id, false).then(({ remove, count }) => {
    console.log(remove)
    console.log(count)
}).catch((error) => {
    console.log(error)
})