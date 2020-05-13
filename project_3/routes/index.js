const express = require('express');
const router = express.Router();

// Get Home page
router.get('/', ensureAuth, (req,res,next) => {
    res.render('index', { title: 'Members'});
    //do something only if user is authenticated
});

function ensureAuth(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;