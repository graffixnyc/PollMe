const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return votesAndMetrics.countVote("af31d83e-8a77-4b73-83ab-356d3e9e0066", 0,0,0,1 ,"27ff7b6f-50ce-4223-ad84-c2d5f696043e","M");
    }).then(() => {
        console.log("Done seeding database");
        db.close();
    });
}, (error) => {
    console.error(error);
});


//27ff7b6f-50ce-4223-ad84-c2d5f696043e:af31d83e-8a77-4b73-83ab-356d3e9e0066











