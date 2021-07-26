function dbConnect() {
    // Db connection
    const mongoose = require('mongoose')
   

    mongoose.connect(process.env.url, {
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