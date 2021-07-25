const mongoose = require('mongoose')

const Schema = mongoose.Schema

const progresSchema = new Schema({
    new_progress_task: {
        type: String,
        required: true
    }

})

const Progress = mongoose.model('Progress', progresSchema)

module.exports = Progress