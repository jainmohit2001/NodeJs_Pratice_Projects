const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // A library to help you hash passwords.

mongoose.connect('mongodb://localhost/nodeauth');
const db = mongoose.connection;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true // a single account with a given username can exist in the db
    },
    password: {
        type: String,
        required: true,
        bcrypt: true //hash the string using bcrypt
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) =>{
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if(err) throw  err;
         newUser.password = hash;
         newUser.save(callback);
    });
};

module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
};