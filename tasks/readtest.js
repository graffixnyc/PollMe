const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
//const classes = data.classes;
//test file just to make sure we have data in the DB for testing/debugging purposes 

let getUsers = users.getAllUsers();
getUsers.then((users) => {
    console.log("******USERS******");
    console.log(users);
});


let getPolls = polls.getAllPolls();
getPolls.then((polls) => {
    console.log("******Polls******");
    console.log(polls);
});


let getPollsByCat = polls.getPollsByCategory("Technology");
getPollsByCat.then((polls) => {
    console.log("******Polls By Tech Cat******");
    console.log(polls);
});

// let getClasses = classes.getAllClasses();
// getClasses.then((classes) => {
//     console.log("******CLASSES******");
//     console.log(classes);
// });