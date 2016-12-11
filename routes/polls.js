
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const votesmatrixData = data.votesAndMetrics;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get("/", function(request, response) {
    // need to change this to the page Haoyang and Seito create
    pollsData.getAllPolls().then((polls) => {
        let pollsInfo = [];
        for(i = 0; i < polls.length; i++) {
            let subpoll = {};
            subpoll._id = polls[i]._id;
            subpoll.question = polls[i].question;
            subpoll.category = polls[i].category;
            subpoll.postedDate = polls[i].postedDate;
            votesmatrixData.getVotesForPoll(polls[i]._id).then((votes) => {
                subpoll.votes = votes.totalVotesForPoll;
            })
            pollsInfo.push(subpoll);
        }
        response.render("pollme/home_before_login", { poll: pollsInfo });
    })
    .catch((error) => {
        res.status(404).json({ error: "Error!Poll not found" });
    });
});

router.get("/createpoll", function(request, response) {

    console.log(request.user);

    // var categories = ["Movies", "Video Games"];
    if (request.isAuthenticated()) {
        //Render the make poll page or something like that
        //request.user.username has username of user
        response.render('pollme/create_poll', { user: request.user });
    }
    else {
        //Render a login page
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/createpoll" });
        else
            response.render('pollme/login_signup', { redirectPage: "/createpoll" });
    }
});

router.post("/createpoll", function(request, response) {

    var now = new Date();

    var newPoll = request.body;
    if (request.isAuthenticated()) {
        pollsData.addPoll(newPoll.category, now.toDateString(), newPoll.question, newPoll.choice1, newPoll.choice2, newPoll.choice3, newPoll.choice4, request.user._id).then((pollid) => {
            response.redirect("/poll/" + pollid);
        }, (err) => {
            console.log(err);
        });
    }
    else {
        //Render a login page
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/createpoll" });
        else
            response.render('pollme/login_signup', { redirectPage: "/createpoll" });
    }
});


router.get("/poll/:id", function(request, response) {
    // Create a result set to contain data from different collections.
    let pollResult = {};
    pollsData.getPollById(request.params.id).then((pollInfo) => {
        pollResult.poll = pollInfo;
    })
        .then(() => {
            usersData.getUserById(pollResult.poll.createdByUser).then((user) => {
                pollResult.user = user;
            }).then(() => {
                votesmatrixData.getVotesForPoll(request.params.id).then((voteInfo) => {
                    pollResult.vote = voteInfo;
                    response.render("pollme/single_poll", { poll: pollResult });
                });
            });
        })
        .catch(() => {
            res.status(404).json({ error: "Error!Poll not found" });
        })
});

router.post("/voteonpoll", function(request, response) {
    
    var vote = request.body;
    console.log(vote);
    if (request.isAuthenticated()) {
        // Allowed to vote on poll
        votesmatrixData.countVote(vote.pollId, vote.ansChoice1, vote.ansChoice2, vote.ansChoice3, vote.ansChoice4, vote.userId, vote.gender).then(() => {
            response.json({ success: true, pollid: vote.pollId });
        });
    }
    else {
        //Render a login page
        response.json({ success: false, login: true});
        
    }
});

router.post("/search", function(request, response) {
    //If they do not eneter a search term or category to search
    if (!request.body.keyword && request.body.category=="null") {
        Promise.reject("You must specify a search term or category to search");
        // If they enter a search term but no category  
    } else if (request.body.keyword && request.body.category=="null") {
        return pollsData.searchPollsByKeyword(request.body.keyword).then((searchResults)=>{
            //render page here
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", {poll: searchResults});
        });
        //If they search category but no keyword
    } else if (request.body.category  && !request.body.keyword) {
        return pollsData.getPollsByCategory(request.body.category).then((searchResults)=>{
            //render page here
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", {poll: searchResults});
        });
        //If they search by keyword and category
    } else {
        return pollsData.searchPollsByKeywordAndCategory(request.body.keyword, request.body.category).then((searchResults)=>{
            //render page here
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", {poll: searchResults});
        });
    }
});

router.post("/commentonpoll", function(request, response) {

    console.log(request.body);
    if (request.isAuthenticated()) {
        // Allowed to comment on poll
        // request.user.username has username of user
        if(request.body.comment && request.body.comment !== "")
            pollsData.addCommentToPoll(request.body.pollid, request.body.poster, request.body.comment).then(() => {
                response.redirect("/poll/" + request.body.pollid);
            }, (err) => {
                console.log(err);
            });
        else
            response.redirect("/poll/" + request.body.pollid);
    }
    else {
        //Render a login page
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/poll/" + request.body.pollid });
        else
            response.render('pollme/login_signup', { redirectPage: "/poll/" + request.body.pollid });
    }
});

module.exports = router;
