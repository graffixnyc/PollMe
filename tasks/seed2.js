const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
  return votesAndMetrics.countVote("dbe48b40-9bf2-42e6-b631-8d0ea4b03d4b", 0,0,0,1 ,"21749010-514f-40fc-92b1-e3e9b20ac85f","M").then(() => {
    return votesAndMetrics.countVote("20fd8f59-04fb-4a7a-8ad5-8adad6c0067c", 1,0,0,0 ,"21749010-514f-40fc-92b1-e3e9b20ac85f","M").then(() => {
        
     
    
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








