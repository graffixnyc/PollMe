const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
  return votesAndMetrics.countVote("4edd9b63-ab58-40e5-a189-6ef4a436fd36", 0,0,0,1 ,"1f4a7d5a-87de-4d29-b5b8-c0f696d6ae74","M").then(() => {
        console.log("Done seeding database");
        db.close();
    
}, (error) => {
    console.error(error);
});


//27ff7b6f-50ce-4223-ad84-c2d5f696043e:af31d83e-8a77-4b73-83ab-356d3e9e0066
//  1f4a7d5a-87de-4d29-b5b8-c0f696d6ae74:4edd9b63-ab58-40e5-a189-6ef4a436fd36















