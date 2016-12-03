const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return votesAndMetrics.countVote("ef31262d-ec86-4053-8baa-ea34a58061cb", 0,0,0,1 ,"7457b1c8-5210-4aad-bbfa-444d3e157671","M");
    }).then(() => {
        console.log("Done seeding database");
        db.close();
    });
}, (error) => {
    console.error(error);
});


//7457b1c8-5210-4aad-bbfa-444d3e157671:ef31262d-ec86-4053-8baa-ea34a58061cb









