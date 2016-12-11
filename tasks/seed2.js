const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
//     return votesAndMetrics.countVote("de7f296d-c1d9-48a1-b002-6a614bfddab5", 0,0,0,1 ,"cb343e33-47da-4818-b032-fc02ffa793c1","M").then(() => {
//      return votesAndMetrics.countVote("b41f72f8-a40f-417a-8c43-4f25beb9678d", 1,0,0,0 ,"cb343e33-47da-4818-b032-fc02ffa793c1","M").then(() => {
//  });
//  });


// }, (error) => {
//     console.error(error);
// });
//});
// let poll1={}
//   return polls.updatePoll("74bd807d-8294-4325-b195-fa657dad41bb",poll1 )

  // return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {

  //       console.log(user.firstName);
  // });


  // return polls.getPollById("9d26c80a-c359-44f6-9d54-244b6b956a25" ).then((poll) => {

  //       console.log(poll.question);
  // });

 return users.updateUser("cb343e33-47da-4818-b032-fc02ffa793c1","F").then(() => {

        //console.log(poll.question);
   });
//  return polls.searchPollsByKeyword("phone").then((polls) => {
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
