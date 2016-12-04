const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
  return votesAndMetrics.countVote("541f4b44-5b43-4e05-aa10-478f06595d29", 0,0,0,1 ,"9494fae3-628a-40e8-b29a-79b161079d60","M").then(() => {
        console.log("Done seeding database");
     
    
}, (error) => {
    console.error(error);
}).then(()=>{
    return votesAndMetrics.countVote("6de25343-a9e8-4eaf-8823-8dae8bdc3e78", 0,0,0,1 ,"9494fae3-628a-40e8-b29a-79b161079d60","M").then(() => {
        console.log("Done seeding database");
     
    
}, (error) => {
    console.error(error);
});
});



//   return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {
       
//         console.log(user.firstName);
//   });


//9494fae3-628a-40e8-b29a-79b161079d60:541f4b44-5b43-4e05-aa10-478f06595d29








