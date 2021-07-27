const mongoose = require('mongoose');

// create schema 
const taskmanager = new mongoose.Schema({
    firstname: {
        type: String,
        tolowercase: true
    },
    lastname: {
        type: String,
        tolowercase: true
    },
    email: {
        type: String
    },
    UniversalTaskId: {
        type: String
    },
    toDoSection: [{
        toDoTaskText: {
            type: String,
            tolowercase: true
        }
    }],
    InProgressSection: [{

        ProgressTaskText: {
            type: String,
            tolowercase: true
        }
    }],
    InCompletedSection: [{

        CompletedTaskText: {
            type: String,
            tolowercase: true
        }
    }],
    password: {
        type: String
    },
    confirmpassword: {
        type: String
    }
})

const User_data = new mongoose.model("User_data", taskmanager);

module.exports = User_data;