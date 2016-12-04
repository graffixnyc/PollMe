const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
  return votesAndMetrics.countVote("692ce54d-9c9c-4601-b47b-44d938a2682e", 0,0,0,1 ,"d9d95105-3394-4056-b2a7-bbb48958884f","M").then(() => {
        console.log("Done seeding database");
     
    
}, (error) => {
    console.error(error);
}).then(()=>{
    return votesAndMetrics.countVote("f05ee74e-dd5f-43fb-be94-3add9cf0ce9f", 0,0,0,1 ,"d9d95105-3394-4056-b2a7-bbb48958884f","M").then(() => {
        console.log("Done seeding database");
     
    
}, (error) => {
    console.error(error);
});
});



//   return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {
       
//         console.log(user.firstName);
//   });


//9494fae3-628a-40e8-b29a-79b161079d60:541f4b44-5b43-4e05-aa10-478f06595d29  d9d95105-3394-4056-b2a7-bbb48958884f:692ce54d-9c9c-4601-b47b-44d938a2682e








