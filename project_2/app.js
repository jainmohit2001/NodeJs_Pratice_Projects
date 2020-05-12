const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');

const routes = require(path.join(__dirname, 'routes', 'index'));
const about = require(path.join(__dirname, 'routes', 'about'));
const contact = require(path.join(__dirname, 'routes', 'contact'));

const app = express(); //create a server with express

// view engine setup
app.set('views', path.join(__dirname,'views')); //the output files ".html or .json or .txt or .jade"
app.set('view engine', 'jade'); //what kind of files are you rendering?

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //serve the static files which include JS, CSS, images and other static objects

app.use('/', routes); // route the destination "/" to ./routes/index.js
app.use('/about', about); // route the destination "/about" to ./routes/about.js
app.use('/contact',contact); // route the destination "/contact" to ./routes/contact.js

// catch 404 and forward to error handler
app.use( (req, res, next) => {
    let error = new Error('Not Found');
    error.status = 400;
    next(error);
});

// error handlers


// development error handler
// will print stacktrace
if(app.get('env') === 'development'){
    app.use( (err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;