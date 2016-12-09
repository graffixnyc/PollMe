
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const votesmatrixData = data.votesAndMetrics;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

 router.get("/", function (request, response) {
        // need to change this to the page Haoyang and Seito create
        pollsData.getAllPolls().then((polls) => {
            response.render("pollme/home_before_login", {poll: polls});
        })
        .catch((error) => {
            response.status(500).json({error: error});
        });
    });

router.get("/createpoll", function (request, response) {
    if(request.isAuthenticated()) {
        //Render the make poll page or something like that
        //request.user.username has username of user
        response.render('pollme/create_poll', {user: request.user});
    }
    else {
        //Render a login page
        if(request.flash().error)
            response.render('pollme/loginpage', { error: request.flash().error, redirectPage: "/makepoll" });
        else
            response.render('pollme/loginpage', { redirectPage: "/createpoll" });
    }
});

router.post("/createpoll", function (request, response) {
    if(request.isAuthenticated()) {
        
    }
    else {
        //Render a login page
        if(request.flash().error)
            response.render('pollme/loginpage', { error: request.flash().error, redirectPage: "/makepoll" });
        else
            response.render('pollme/loginpage', { redirectPage: "/createpoll" });
    }
});


router.get("/poll/:id", function (request, response) {
    // Create a result set to contain data from different collections.
    let pollResult = {};
    pollsData.getPollById(request.params.id).then((pollInfo) => {
        pollResult.poll = pollInfo;
    })
    .then(() => {
        usersData.getUserById(pollResult.poll.createdByUser).then((user) => {
            pollResult.user = user;
        });
        votesmatrixData.getVotesForPoll(request.params.id).then((voteInfo) => {
            pollResult.vote = voteInfo;
        });
        response.render("pollme/single_poll", {poll: pollResult});
    })
    .catch(() => {
        res.status(404).json({error: "Error!Poll not found"});
    })
});

// router.get("/polls", function (request, response) {
//     polls.getAllPolls().then((polls)=>{
//             console.log(JSON.stringify(polls));
//                 // need to change this to the page Haoyang and Seito create
//                 //res.render('locations/single', { polls: polls});
//          })
    
// });

router.post("/voteonpoll", function (request, response) {
    
    //I guess the poll id should in the request somewhere
    
    if(request.isAuthenticated()) {
        // Allowed to vote on poll
        // request.user.username has username of user
    }
    else {
        //Render a login page
        if(request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/" });
        else
            response.render('pollme/login_signup', { redirectPage: "/" });
    }
});

router.post("/commentonpoll", function (request, response) {
    
    //I guess the poll id should in the request somewhere
    
    if(request.isAuthenticated()) {
        // Allowed to comment on poll
        // request.user.username has username of user
    }
    else {
        //Render a login page
        if(request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/" });
        else
            response.render('pollme/login_signup', { redirectPage: "/" });
    }
});

module.exports = router;