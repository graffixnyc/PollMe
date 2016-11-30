
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get("/makepoll", function (request, response) {
    if(req.isAuthenticated()) {
        //Render the make poll page or something like that
        //request.user.username has username of user
    }
    else {
        //Render a login page
    }
});
    
router.get("/poll/:id", function (request, response) {
    
    
});


module.exports = router;