const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const { check, validationResult } = require('express-validator'); //use for validation of user's info like email and password

let User = require(path.join(__dirname,'..', 'models', 'user'));


router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
    res.render('register', {title: 'Register'});
});

router.get('/login', (req, res, next) => {
    res.render('login', {title: 'Login'});
});

router.post('/register', [
    // Validator
    check('name', 'Name Field is required').notEmpty(),
    check('email', 'Email Field is required').notEmpty(),
    check('email', 'Email not Valid').isEmail(),
    check('username', 'UserName Field is required')
        .isLength({min: 6})
        .notEmpty(),
    check('password', 'Password Field is required').notEmpty(),
    check('password2', 'Passwords do not match')
        .isLength({min: 8})
        .equals('password')
], (req, res, next) => {

    let name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        password2 = req.body.password2;
    console.log(name,email,username,password,password2);
    let profileImageServer;
    // check for image fields
    if(req.files && req.files.profileimage){
        console.log('Uploading File ...');
        let profileImageName = req.files.profileimage.originalname,
            profileImageServer = req.files.profileimage.name,
            profileImageMime = req.files.profileimage.mimetype,
            profileImagePath = req.files.profileimage.path,
            profileImageExt = req.files.profileimage.extension,
            profileImageSize = req.files.profileimage.size;
    }
    else{
        let profileImageServer = "noimage.png";
    }

    // errors
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('register', {
            errors: errors.array(),
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        })
    }
    else{
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileImageServer
        });

        User.createUser(newUser, (err, user) => {
            if(err) throw err;
            console.log(err);
        });

        req.flash('success', "You are now registered and may log in");
        res.location('/');
        res.redirect('/');
    }

});

passport.serializeUser((user, done) => {
    done(null, user.id); //saved to session -> req.session.passport.user = {id: '..'}
});

/*
serializeUser determines which data of the user object should be stored in the session.
The result of the serializeUser method is attached to the session as req.session.passport.user = {}.
Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}
 */
passport.deserializeUser((id, done) => {
    User.getUserById(id, (err,user) => {
        done(err, user); //user object attaches to the request as req.user
    });

});
/*
The first argument of deserializeUser corresponds to the key of the user object that was given to the done function.
So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc).
In deserializeUser that key is matched with the in memory array / database or any data resource.
The fetched object is attached to the request object as req.user
 */


// Passport strategy for authenticating with a username and password.
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, (err,user) => {
            if(err) throw err;
            if(!user){
                console.log("Unknown USer");
                return done(null, false, {message: "Unknown User"});
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    console.log("Invalid Password");
                    return done(null, false, {message: "Invalid Password"});
                }
            })
        })
    }
));
// Use passport.authenticate(), specifying the 'local' strategy, to authenticate requests.
router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}), (req, res) => {
    console.log('Authentication Successful');
    req.flash('alert-success', 'You are Logged in!')
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('alert-success', 'You have Logged out!');
    res.redirect('/users/login');
});

module.exports = router;




