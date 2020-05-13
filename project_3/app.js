const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const session = require('express-session'); /* every user of your API or website will be assigned a unique session, and this allows you to store the user state.*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; /*Passport's sole purpose is to authenticate requests, which it does through an extensible set of plugins known as strategies.*/
const multer = require('multer'); /* Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. */
const { check, validationResult } = require('express-validator'); //use for validation of user's info like email and password
const flash = require('connect-flash');
/*The flash is a special area of the session used for storing messages.
Messages are written to the flash and cleared after being displayed to the user. */

const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

const routes = require(path.join(__dirname, 'routes','index'));
const users = require(path.join(__dirname, 'routes', 'users'));


const app = express();

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// file upload handle
app.use(multer({dest: './uploads'}).single('profileimage'));


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // use favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(expressValidator());
/*{
    errorFormatter: function(param, msg, value){
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        console.log(namespace);
        console.log(root);
        console.log(formParam);
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        console.log(formParam);
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }

}));*/
//Handle sessions

app.use(session({
    secret: 'sonic', //must needed
    saveUninitialized: true,
    /* About saveUninitialized: If during the lifetime of the request the session object isn't modified then,
    at the end of the request and when saveUninitialized is false,the (still empty, because unmodified) session object will not be stored in the session store.
    The reasoning behind this is that this will prevent a lot of empty session objects being stored in the session store.
    Since there's nothing useful to store, the session is "forgotten" at the end of the request.*/
    resave: true
    /* About resave: this may have to be enabled for session stores that don't support the "touch" command.
    What this does is tell the session store that a particular session is still active, which is necessary because some stores will delete idle (unused) sessions after some time.
    If a session store driver doesn't implement the touch command, then you should enable resave so that even when a session wasn't changed during a request, it is still updated in the store (thereby marking it active)
     */
}));
/* The session is attached to the request, so you can access it using req.session.
This object can be used to get data out of the session, and also to set data */

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
// A function that formats the error objects before returning them to your route handlers.


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // serving static files

app.use(flash()); // use flash for local messages
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
//An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any).
    next();
});

app.all('*', (req, res, next) => { // get the current user
    res.locals.user = req.user || null;
    next();
});
app.use('/', routes);
app.use('/users', users);

// Catch 404 error and forward to error handlers

app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 400;
    next(err);
});

// error handlers

// development error handler
//will print the stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktrace leaked to user

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
