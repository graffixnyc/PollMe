const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
  return votesAndMetrics.countVote("48b24db4-b700-4aa4-b6ee-eb819aa2d627", 0,0,0,1 ,"16429151-fd34-4f70-a8be-257970da8a86","M").then(() => {
        console.log("Done seeding database");
        db.close();
    
}, (error) => {
    console.error(error);
});


//27ff7b6f-50ce-4223-ad84-c2d5f696043e:af31d83e-8a77-4b73-83ab-356d3e9e0066
//  16429151-fd34-4f70-a8be-257970da8a86:48b24db4-b700-4aa4-b6ee-eb819aa2d627
















