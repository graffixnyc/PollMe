const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
  return votesAndMetrics.countVote("74bd807d-8294-4325-b195-fa657dad41bb", 0,0,0,1 ,"b7f8fc28-9b41-4c4c-ab63-8a62214c58a5","M").then(() => {
    return votesAndMetrics.countVote("e4281c72-1a83-4a60-b8db-a5fa45efe9dc", 1,0,0,0 ,"b7f8fc28-9b41-4c4c-ab63-8a62214c58a5","M").then(() => {
        
     
    
// }, (error) => {
//     console.error(error);
// });
// });
// let poll1={}
//   return polls.updatePoll("74bd807d-8294-4325-b195-fa657dad41bb",poll1 )

  // return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {
       
  //       console.log(user.firstName);
  // });
 
 
//  return polls.searchPolls("phone").then((polls) => {
//        if (!polls){

//        }else{
//         console.log(polls.length);
//        }
//   });

//  return polls.getPollsByCategory("Technology").then((polls) => {
//        if (!polls){

//        }else{
//         console.log(polls.length);
//        }
//   });
// b7f8fc28-9b41-4c4c-ab63-8a62214c58a5:74bd807d-8294-4325-b195-fa657dad41bb
// b7f8fc28-9b41-4c4c-ab63-8a62214c58a5:f350d60d-e065-4bb1-b173-af4903fff63a
// b7f8fc28-9b41-4c4c-ab63-8a62214c58a5:e4281c72-1a83-4a60-b8db-a5fa45efe9dc




