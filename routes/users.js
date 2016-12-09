

const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get("/profile", function (request, response) {
    
    if(request.isAuthenticated())
        response.redirect('/user/' + request.user.username);
    else {
        if(request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/profile" });
        else
            response.render('pollme/login_signup', { redirectPage: "/profile" });
    }
});


router.get("/user/:username", function (request, response) {
    if(!request.params.username) {
        //error handling
        
    }
    usersData.getUserByUsername(request.params.username).then((user) => {
        if(!user) {
         //error handling   
        }
        
        response.render('pollme/userprofile', { user: user });
        
    }, (err) => {
     //error handling   
     console.log(err);   
    });
    
});

// router.post("/login", function(request, response, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if(info.message) request.flash('error', info.message);
//     if (err) { return next(err); }
//     if (!user) { return response.redirect(request.body.redirectPage); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return response.redirect(request.body.redirectPage);
//     });
//   })(request, response, next);
// });

//Update the post /login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/private',
    failureRedirect: '/',
    failureFlash: true
}));

//Pakage the validation function into passport.js module.
router.get('/private', isLoggedIn, function(req, res) {
    res.render('pollme/user_home', {
    user: req.user 
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();
    else 
        res.redirect('/');
}

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
    usersData.createHashedPassword(newUser.signUpPassword).then((hashedPassword) => {
        usersData.addUser(newUser.signUpUsername, newUser.firstname, newUser.lastname, newUser.email, newUser.gender, newUser.city, newUser.state, newUser.age, hashedPassword).then((user) => {
            request.login(user, function(err) {
                if (err) { console.log(err); }
                response.redirect(request.body.redirectPageSignUp);
            });

        }, (err) => {
            //error handling
            console.log(err);
        });
    }, (err) => {
        //error handling
        console.log(err);
    });
});

router.get('/logout', function(request, response){
  request.logout();
  response.redirect('/');
});

module.exports = router;