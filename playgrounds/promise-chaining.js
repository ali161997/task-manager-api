require('../src/db/mongoose.js')
const User = require('../src/models/User')
//A.findByIdAndUpdate(id, update, options, callback) 
const id = '6118acd74a81312c545a8c79'
// User.findByIdAndUpdate(id, { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((count) => {
//     console.log(count)
// })

const updateAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age });
    return count;
}

updateAndCount(id, 2).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})