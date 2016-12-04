const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
  return votesAndMetrics.countVote("77db0d5a-338f-494d-8b5e-4febc5976ede", 0,0,0,1 ,"fd71fa87-b38c-4a1e-a4c8-2f67c35161e5","M").then(() => {
        console.log("Done seeding database");
     
    
}, (error) => {
    console.error(error);
});


//   return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {
       
//         console.log(user.firstName);
//   });










