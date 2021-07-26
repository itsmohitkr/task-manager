function dbConnect() {
    // Db connection
    const mongoose = require('mongoose')
    const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@task-manager.nsuiu.mongodb.net/task-manager?retryWrites=true&w=majority`

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })

    const connection = mongoose.connection
    connection.once('open', function () {
        console.log('Database connected...')
    }).catch(function (err) {
        console.log('Connection failed...')
    })
}

module.exports = dbConnect