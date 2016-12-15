const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const usersPollsData = data.usersandpolls;
const votesmatrixData = data.votesAndMetrics;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const xss = require('xss');

router.get("/", function (request, response) {
    // need to change this to the page Haoyang and Seito create
    pollsData.getAllPolls().then((polls) => {
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
        response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
    })
        .catch((error) => {
            response.status(404).json({ error: "Error!Poll not found" });
        });
});

router.get("/createpoll", function (request, response) {

    console.log(request.user);

    // var categories = ["Movies", "Video Games"];
    if (request.isAuthenticated()) {
        //Render the make poll page or something like that
        //request.user.username has username of user
        response.render('pollme/create_poll', { user: xss(request.user), loginuser: xss(request.user) });
    }
    else {
        //Render a login page
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/createpoll" });
        else
            response.render('pollme/login_signup', { redirectPage: "/createpoll" });
    }
});

router.post("/createpoll", function (request, response) {

    var now = new Date();

    var newPoll = request.body;
    if (request.isAuthenticated()) {
        var currentDate = new Date()
        pollsData.addPoll(xss(newPoll.category), currentDate, xss(newPoll.question), xss(newPoll.choice1), xss(newPoll.choice2), xss(newPoll.choice3), xss(newPoll.choice4), xss(request.user._id)).then((pollid) => {
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


router.get("/poll/:id", function (request, response) {
    // Create a result set to contain data from different collections.
    let pollResult = {};
    pollsData.getPollById(xss(request.params.id)).then((pollInfo) => {
        pollResult.poll = pollInfo;
    })
        .then(() => {
            pollResult.user = request.user;
            votesmatrixData.getVotesForPoll(xss(request.params.id)).then((voteInfo) => {
                pollResult.vote = voteInfo;
                response.render("pollme/single_poll", { poll: pollResult, loginuser: xss(request.user) });
            })
        })
        .catch(() => {
            res.status(404).json({ error: "Error!Poll not found" });
        })
});

router.post("/voteonpoll", function (request, response) {

    var vote = request.body;
    var user = request.user;
    console.log(vote);

    if (request.isAuthenticated()) {
        var theyVoted = false;
        usersData.getPollsUserVotedin(xss(vote.userid)).then((polls) => {
            console.log(polls)
            for (var i = 0; i < polls.length; i++) {
                if (polls[i].pollId == vote.pollid) {
                    theyVoted = true;
                }
            }
            if (theyVoted == true) {
                Promise.reject("User Voted already");
                //needs work
                request.flash('errorMessage', 'User Voted already in poll');
                response.send(request.flash());
            } else {
                votesmatrixData.countVote(vote.pollid, vote.selector, vote.userid, user.gender).then(() => {
                    let voted = true;
                    response.redirect("/poll/" + vote.pollid + "?voted=" + voted);
                });
            }
        })
    }
    else {
        //Render a login page
        response.render('pollme/login_signup', { redirectPage: "/poll/" + xss(request.body.pollid) });

    }
});

router.post("/search", function (request, response) {
    //If they do not eneter a search term or category to search
    if (!xss(request.body.keyword) && xss(request.body.category) == "null") {
        Promise.reject("You must specify a search term or category to search");
        // If they enter a search term but no category
    } else if (xss(request.body.keyword) && xss(request.body.category) == "null") {
        return pollsData.searchPollsByKeyword(xss(request.body.keyword).trim()).then((searchResults) => {
            let pollsInfo = [];
            for (i = 0; i < searchResults.length; i++) {
                let subpoll = {};
                subpoll._id = searchResults[i]._id;
                subpoll.question = searchResults[i].question;
                subpoll.category = searchResults[i].category;
                subpoll.postedDate = searchResults[i].postedDate;
                votesmatrixData.getVotesForPoll(searchResults[i]._id).then((votes) => {
                    if (votes) {
                        subpoll.votes = votes.totalVotesForPoll;
                    }
                })
                pollsInfo.push(subpoll);
            }
            //render page here
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
        });
        //If they search category but no keyword
    } else if (xss(request.body.category) && !xss(request.body.keyword)) {
        return pollsData.getPollsByCategory(xss(request.body.category)).then((searchResults) => {
            //render page here
            let pollsInfo = [];
            for (i = 0; i < searchResults.length; i++) {
                let subpoll = {};
                subpoll._id = searchResults[i]._id;
                subpoll.question = searchResults[i].question;
                subpoll.category = searchResults[i].category;
                subpoll.postedDate = searchResults[i].postedDate;
                votesmatrixData.getVotesForPoll(searchResults[i]._id).then((votes) => {
                    if (votes) {
                        subpoll.votes = votes.totalVotesForPoll;
                    }
                })
                pollsInfo.push(subpoll);
            }
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
        });
        //If they search by keyword and category
    } else {
        return pollsData.searchPollsByKeywordAndCategory(xss(request.body.keyword).trim(), xss(request.body.category)).then((searchResults) => {
            //render page here
            let pollsInfo = [];
            for (i = 0; i < searchResults.length; i++) {
                let subpoll = {};
                subpoll._id = searchResults[i]._id;
                subpoll.question = searchResults[i].question;
                subpoll.category = searchResults[i].category;
                subpoll.postedDate = searchResults[i].postedDate;
                votesmatrixData.getVotesForPoll(searchResults[i]._id).then((votes) => {
                    if (votes) {
                        subpoll.votes = votes.totalVotesForPoll;
                    }
                })
                pollsInfo.push(subpoll);
            }
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
        });
    }
});

router.post("/commentonpoll", function (request, response) {

    console.log(request.body);
    if (request.isAuthenticated()) {
        // Allowed to comment on poll
        // request.user.username has username of user
        if (xss(request.body.comment) && xss(request.body.comment) !== "")
            pollsData.addCommentToPoll(xss(request.body.pollid), xss(request.user.username), xss(request.body.comment)).then(() => {
                response.redirect("/poll/" + xss(request.body.pollid));
            }, (err) => {
                console.log(err);
            });
        else
            response.redirect("/poll/" + xss(request.body.pollid));
    }
    else {
        //Render a login page
        if (request.flash().error)
            response.render('pollme/login_signup', { error: request.flash().error, redirectPage: "/poll/" + request.body.pollid });
        else
            response.render('pollme/login_signup', { redirectPage: "/poll/" + xss(request.body.pollid0) });
    }
});

module.exports = router;
