

const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const votesmatrixData = data.votesAndMetrics;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require("req-flash");

router.get("/user/:username", function (request, response) {
    if (!request.params.username) {
        //error handling

    }
    else {
        usersData.getUserByUsername(request.params.username).then((user) => {
            pollsData.getPollsByUser(user._id).then((polls) => {
                let pollsInfo = [];
                for (i = 0; i < polls.length; i++) {
                    let subpoll = {};
                    subpoll._id = polls[i]._id;
                    subpoll.question = polls[i].question;
                    subpoll.category = polls[i].category;
                    subpoll.postedDate = polls[i].postedDate;
                    votesmatrixData.getVotesForPoll(polls[i]._id).then((votes) => {
                        if (votes) {
                            subpoll.votes = votes.totalVotesForPoll;
                        }
                    })
                    pollsInfo.push(subpoll);
                }
                response.render("pollme/mypage_mypoll", { poll: pollsInfo, loginuser: user });
            });
        });
    }

});

router.get("/login", function (request, response) {
    if (!request.isAuthenticated())
        response.render("pollme/login_signup", { message: request.flash('loginMessage') });
})

//Update the post /login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/mypolls', isLoggedIn, function (req, res) {
    console.log(req.user._id)
    pollsData.getPollsByUser(req.user._id).then((polls) => {
        let pollsInfo = [];
        for (i = 0; i < polls.length; i++) {
            let subpoll = {};
            subpoll._id = polls[i]._id;
            subpoll.question = polls[i].question;
            subpoll.category = polls[i].category;
            subpoll.postedDate = polls[i].postedDate;
            votesmatrixData.getVotesForPoll(polls[i]._id).then((votes) => {
                if (votes) {
                    subpoll.votes = votes.totalVotesForPoll;
                }
            })
            pollsInfo.push(subpoll);
        }
        res.render("pollme/mypage_mypoll", { poll: pollsInfo, loginuser: req.user });
    })

});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
        res.redirect('/login');
}


router.post("/signup", function (request, response) {

    let newUser = request.body;
    if (newUser.signUpPassword != newUser.signUpPassword2) {
        //passwords do not match
        //We need to display error to user better
        request.flash('errorMessage', 'Passwords do not Match');
        response.send(request.flash());
    } else {
        usersData.getUserByUsernameOrEmail(newUser.signUpUsername.toLowerCase(), newUser.email).then((user) => {
            if (user) {
                //Username already in system
                //We need to display error to user better
                request.flash('errorMessage', 'Username or User Email Already Exists');
                response.send(request.flash());

            } else {
                usersData.createHashedPassword(newUser.signUpPassword).then((hashedPassword) => {
                    usersData.addUser(newUser.signUpUsername, newUser.firstname, newUser.lastname, newUser.email, newUser.gender, newUser.city, newUser.state, newUser.age, hashedPassword).then((user) => {
                        request.login(user, function (err) {
                            if (err) { console.log(err); }
                            response.redirect("/");
                        });

                    }, (err) => {
                        //error handling
                        console.log(err);
                    });
                }, (err) => {
                    //error handling
                    console.log(err);
                });
            }
        })

    }
});

router.get('/editprofile', function (request, response) {

    if (request.isAuthenticated()) {
        response.render('pollme/mypage_edit', { user: request.user, loginuser: request.user });

    }
    else {
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/editprofile" });
        else
            response.render('pollme/login_signup', { redirectPage: "/editprofile" });
    }
});

router.post('/editprofile', function (request, response) {

    if (request.isAuthenticated()) {
        if (!request.body.signUpPassword  ||!request.body.signUpPassword2){
            //We need to display error to user
             console.log("user did not enter either password 1 or password 2")
             request.flash('errorMessage', 'Either Password or Password Confirmation are Missing');
                response.send(request.flash());
        } else if (!request.body.gender) {
            //We need to display error to user
            console.log("user did not select a gender")
            request.flash('errorMessage', 'User did not select a gender');
                response.send(request.flash());
        } else if (!request.body.state) {
           //We need to display error to user
            console.log("user did not select a state")
            request.flash('errorMessage', 'User did not select a state');
                response.send(request.flash());
        } else {
            if (request.body.signUpPassword !== request.body.signUpPassword2) {
                //We need to display error to user
                console.log("Different passwords");
                request.flash('errorMessage', 'The Passwords do not match');
                response.send(request.flash());
            }
            else {
                console.log(request.body);

                usersData.createHashedPassword(request.body.signUpPassword).then((hashedPassword) => {
                    var updatedUser = {
                        firstName: request.body.firstname, lastName: request.body.lastname, username: request.body.username, email: request.body.email,
                        gender: request.body.gender, city: request.body.city, state: request.body.state, age: request.body.age, hashedPassword: hashedPassword
                    };

                    votesmatrixData.updateUser(request.user._id, updatedUser).then((user) => {
                        console.log(user.username);
                        request.login(user, function (err) {
                            if (err) { console.log(err); }
                            response.redirect("/mypolls");
                        });
                    }, (err) => {
                        console.log(err);
                    });
                }, (err) => {
                    console.log(err);
                });

            }
        }
    }
    else {
        console.log(request.user.username);
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/editprofile" });
        else
            response.render('pollme/login_signup', { redirectPage: "/editprofile" });
    }
});

router.get('/logout', function (request, response) {
    request.logout();
    response.redirect('/');
});

module.exports = router;