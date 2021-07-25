const express = require('express');
const hbs = require('hbs');
const port = process.env.PORT || 3000;
const {
    v4: uuidv4
} = require('uuid')

const app = express();

// database connection
const dbConnect = require('./db')
dbConnect()

// require cooment module
const Task_list = require('../models/task')
const Progress_list = require('../models/progress')
const Completed_list = require('../models/completed')

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));



app.set("view engine", "hbs");

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:index', (req, res) => {
    res.render('index', {
        indexId: req.params.index
    }) // pass the room id to roo.ejs
})

// Routes 
app.post('/api/tasks', (req, res) => {
    const addTask = new Task_list({
        newtask: req.body.task
        // username: req.body.username
    })
    addTask.save().then(response => {
        res.send(response)
    })
})
app.get('/api/tasks', (req, res) => {
    Task_list.find().then(function (task) {
        res.send(task)
    })
})
app.delete('/api/tasks', (req, res) => {    
    const query = {
        "newtask": req.body.delete_task
    };
    console.log(query);
    Task_list.findOneAndDelete(query)
        .then(result => console.log(`Deleted.`))
        .catch(err => console.error(`Delete failed with error: ${err}`))
})


app.post('/api/progress', (req, res) => {
    const add_to_Progress_list = new Progress_list({
           new_progress_task: req.body.task_text
       })
    add_to_Progress_list.save().then(response => {
        res.send(response)
    })
})

app.get('/api/progress', (req, res) => {
    Progress_list.find().then(function (progress_task) {
        res.send(progress_task)
    })
})

app.delete('/api/progress', (req, res) => {
    const query = {
        "new_progress_task": req.body.delete_task_from_progress
    };
    console.log(query);
    Progress_list.findOneAndDelete(query)
        .then(result => console.log(`Deleted.`))
        .catch(err => console.error(`Delete failed with error: ${err}`))

})


app.post('/api/completed', (req, res) => {
       const add_to_completed_list = new Completed_list({
           new_completed_task: req.body.task_text
       })
    add_to_completed_list.save().then(response => {
        res.send(response)
    })
})

app.get('/api/completed', (req, res) => {
    Completed_list.find().then(function (completed_task) {
        res.send(completed_task)
    })
})

app.delete('/api/completed', (req, res) => {
    const query = {
        "new_completed_task": req.body.delete_task_from_completed
    };
    console.log(query);
    Completed_list.findOneAndDelete(query)
        .then(result => console.log(`Deleted.`))
        .catch(err => console.error(`Delete failed with error: ${err}`))

})
app.listen(3000, () => {
    console.log("server has started at http://localhost:3000");
})
