require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const validator = require('validator');


// Load User model
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth');
const {
    v4: uuidv4
} = require('uuid')

const port = process.env.PORT || 4000;


// database connection
const dbConnect = require('./db')
dbConnect()

require('../config/passport')(passport);

// require  module
const User = require('../models/registers');


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.reg_msg = req.flash('reg_msg');
    res.locals.drop_msg = req.flash('drop_msg');
    res.locals.mail_msg = req.flash('mail_msg');
    next();
});



app.get('/', ensureAuthenticated,(req, res) => {
    res.render('index', {
        user: req.user,
    }) 
})

// Login Page


app.get("/login", forwardAuthenticated, (req, res) => {
    res.render("login", {
        user: req.user,
    })
})

// Register Page

app.get("/register", forwardAuthenticated,(req, res) => {
    res.render("register")
})

// Register
app.post("/register", (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password,
        confirmpassword
    } = req.body;
    let errors = [];

    if (!firstname || !email || !password || !confirmpassword) {
        errors.push({
            msg: 'Please enter all fields.'
        });
    }

    if (password != confirmpassword) {
        errors.push({
            msg: 'Passwords do not match.'
        });
    }

    if (password.length < 3) {
        errors.push({
            msg: 'Password must be at least 4 characters.'
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            firstname,
            lastname,
            email,
            password,
            confirmpassword
        });
    } else { // no errors
        User.findOne({
            email: email
        })
            .then(user => {
                if (user) {
                    errors.push({
                        msg: 'Email already exists.'
                    });
                    res.render('register', {
                        errors,
                        firstname,
                        lastname,
                        email,
                        password,
                        confirmpassword
                    });
                } else {
                    UniversalTaskId = `${firstname}${uuidv4()}${lastname}`
                    const newUser = new User({
                        firstname,
                        lastname,
                        email,
                        UniversalTaskId,
                        toDoSection: [],
                        InProgressSection: [],
                        InCompletedSection: [],
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'Registration completed successfully.'
                                    );
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
    }
});

app.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});


// to do section 
app.post('/api/tasks', (req, res) => {
    User.findOneAndUpdate({ email: `${req.user.email}` }, { $push: { toDoSection: { "toDoTaskText": `${req.body.task}` } } })
        .then(result => console.log("updated"))
    .catch(err=>console.log(err))
})
app.delete('/api/tasks', (req, res) => {    

    User.findOneAndUpdate({email: `${req.user.email}`},{$pull:{toDoSection:{"toDoTaskText":`${req.body.delete_task}`}}})
    .then(result => console.log(`Deleted.`))
    .catch(err => console.error(`Delete failed with error: ${err}`))
})

app.get('/api/tasks', (req, res) => {
    User.findOne({ email: `${req.user.email}` }, { toDoSection: 1 })
        .then(function (task) {
        res.send(task)
    })
})


// progress section
app.post('/api/progress', (req, res) => {
      User.findOneAndUpdate({ email: `${req.user.email}` }, { $push: { InProgressSection: { "ProgressTaskText": `${req.body.task_text}`} } })
        .then(result => console.log("updated in progress"))
    .catch(err=>console.log(err))
})

app.get('/api/progress', (req, res) => {
   User.findOne({ email: `${req.user.email}` }, { InProgressSection: 1 })
        .then(function (task) {
        res.send(task)
    })
})

app.delete('/api/progress', (req, res) => {
    
    User.findOneAndUpdate({email: `${req.user.email}`},{$pull:{InProgressSection:{"ProgressTaskText":`${req.body.delete_task_from_progress}`}}})
    .then(result => console.log(`Deleted from progress`))
    .catch(err => console.error(`Delete failed with error: ${err}`))
})

// completed section

app.post('/api/completed', (req, res) => {
     User.findOneAndUpdate({ email: `${req.user.email}` }, { $push: { InCompletedSection: { "CompletedTaskText": `${req.body.task_text}`} } })
        .then(result => console.log("updated in completed"))
    .catch(err=>console.log(err))
})

app.get('/api/completed', (req, res) => {
     User.findOne({ email: `${req.user.email}` }, { InCompletedSection: 1 })
        .then(function (task) {
        res.send(task)
    })
})

app.delete('/api/completed', (req, res) => {
     User.findOneAndUpdate({email: `${req.user.email}`},{$pull:{InCompletedSection:{"CompletedTaskText":`${req.body.delete_task_from_completed}`}}})
    .then(result => console.log(`Deleted from completed`))
    .catch(err => console.error(`Delete failed with error: ${err}`))
})

app.listen(port, () => {
    console.log(`server has started at http://localhost:${port}`);
})
