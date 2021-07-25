const mongoose = require('mongoose')

const Schema = mongoose.Schema

const completedSchema = new Schema({
    new_completed_task: {
        type: String,
        required: true
    }

})

const Completed = mongoose.model('Completed', completedSchema)

module.exports = Completed