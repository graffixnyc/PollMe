

const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const votesmatrixData = data.votesAndMetrics;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require("req-flash");
router.get("/profile", function (request, response) {

    if (request.isAuthenticated())
        response.redirect('/user/' + request.user.username);
    else {
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/profile" });
        else
            response.render('pollme/login_signup', { redirectPage: "/profile" });
    }
});


router.get("/user/:username", function (request, response) {
    if (!request.params.username) {
        //error handling

    }
    usersData.getUserByUsername(request.params.username).then((user) => {
        if (!user) {
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

router.get("/login", function (request, response) {
    response.render("pollme/login_signup", { message: request.flash('loginMessage') });
})

//Update the post /login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


// This route is not really needed and is a duplicate of the / route. There is nothing displayed 
// after the user logs in that is private
// router.get('/private', isLoggedIn, function (req, res) {
//     // let userResult = {};
//     // userResult.userInfo = req.user;
//     // console.log(userResult.userInfo);
//     let pollsInfo = [];
//     pollsData.getAllPolls().then((polls) => {
//         for (i = 0; i < polls.length; i++) {
//             let subpoll = {};
//             subpoll._id = polls[i]._id;
//             subpoll.question = polls[i].question;
//             subpoll.category = polls[i].category;
//             subpoll.postedDate = polls[i].postedDate;
//             votesmatrixData.getVotesForPoll(polls[i]._id).then((votes) => {
//                 if (votes) {
//                     subpoll.votes = votes.totalVotesForPoll;
//                 }
//             })
//             pollsInfo.push(subpoll);
//         }
//     })
//     // userResult.pollInfo = pollsInfo;
//     res.render('pollme/home_before_login', {
//         poll: pollsInfo,
//         loginuser: req.user
//     });

// });

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

router.get("/signup", function (request, response) {

    if (request.isAuthenticated()) {
        // user needs to logout first
    }
    else {
        // render sign up page
    }
});


router.post("/signup", function (request, response) {

    let newUser = request.body;
    if (newUser.signUpPassword != newUser.signUpPassword2) {
        //passwords do not match
        request.flash('errorMessage', 'Passwords do not Match');
                response.send(request.flash());
    } else {
        usersData.getUserByUsername(newUser.signUpUsername.toLowerCase()).then((user) => {
            if (user) {
                 request.flash('errorMessage', 'User Already Exists');
                response.send(request.flash());
        
            } else {
                usersData.createHashedPassword(newUser.signUpPassword).then((hashedPassword) => {
                    usersData.addUser(newUser.signUpUsername.toLowerCase(), newUser.firstname, newUser.lastname, newUser.email, newUser.gender, newUser.city, newUser.state, newUser.age, hashedPassword).then((user) => {
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
    // DO THIS NEXT
    if (request.isAuthenticated()) {
        console.log("Logged in");
    }
    else {
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