

const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get("/profile", function (request, response) {

    if(request.isAuthenticated())
        request.redirect('/user/' + request.user.username);
    else {
        if(request.flash().error)
            response.render('pollme/loginpage', { error: request.flash().error, redirectPage: "/profile" });
        else
            response.render('pollme/loginpage', { redirectPage: "/profile" });
    }
});


router.get("/user/:username", function (request, response) {
    
    
});

router.post("/login", function(request, response, next) {
  passport.authenticate('local', function(err, user, info) {
    if(info.message) request.flash('error', info.message);
    if (err) { return next(err); }
    if (!user) { return response.redirect(request.body.redirectPage); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return response.redirect(request.body.redirectPage);
    });
  })(request, response, next);
});

router.get("/signup", function (request, response) {
    
    if(request.isAuthenticated()) {
        // user needs to logout first
    }
    else {
        // render sign up page
    }
});


router.post("/signup", function (request, response) {
    
    let newUser = request.body;
    usersData.addUser(newUser.username, newUser.firstname, newUser.lastname, newUser.email, newUser.gender, newUser.city, newUser.state, newUser.age, newUser.hashedPassword).then((user) => {
       response.redirect("/user/" + user.username); 
    });
    
});

module.exports = router;