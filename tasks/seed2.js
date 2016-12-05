const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
  return votesAndMetrics.countVote("49af3d96-8a42-4697-9216-3d501caac8d8", 0,0,0,1 ,"cdb2965b-d723-41db-a4b3-2885fa1f9c27","M").then(() => {
    return votesAndMetrics.countVote("a89f9cee-d4d8-436f-9c8c-6a2c6d9af1a2", 1,0,0,0 ,"cdb2965b-d723-41db-a4b3-2885fa1f9c27","M").then(() => {
        
     
    
}, (error) => {
    console.error(error);
});
});



//   return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {
       
//         console.log(user.firstName);
//   });

// c8a53f3a-7465-4efb-95ce-5911760dc252:890ef3ee-e10a-4858-b321-ce612c548773
// c8a53f3a-7465-4efb-95ce-5911760dc252:70dd603f-0990-413c-b02e-a570ffdc63dc
// c8a53f3a-7465-4efb-95ce-5911760dc252:8ff28819-fca1-4e71-99e4-704ea8d436b4
//9494fae3-628a-40e8-b29a-79b161079d60:541f4b44-5b43-4e05-aa10-478f06595d29  d9d95105-3394-4056-b2a7-bbb48958884f:692ce54d-9c9c-4601-b47b-44d938a2682e








