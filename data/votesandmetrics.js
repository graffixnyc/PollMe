const mongoCollections = require("../config/mongoCollections");
const votesAndMetrics = mongoCollections.votesAndMetrics;

const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getVotesForPoll(pollId) {
        return votesAndMetrics().then((voteCollection) => {
            return voteCollection
                .findOne({ _id: pollId })
                .then((vote) => {
                    if (!vote) {
                        return Promise.reject(new Error("No Votes for selected Poll")).then(function (error) {
                            //not called
                        }, function (error) {
                            console.log(error);
                        });
                    } else {
                        return vote;
                    }
                });
        });
    },
    countVote(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender) {
        //Serach for the pollid in the votesAndMetrics collection since the _id is the same as the pollID that the votes belong to. 
        return this.getVotesForPoll(pollId).then((votes) => {
            if (!votes) {
                //No Votes found for poll, so we create the votesAndMetrics document
                console.log("Creating Vote Document");
                this.createNewVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender);
            } else {
                //Poll has votes recorded already, so we need to update the votesAndMetrics document
                //call updateVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender)
                console.log("Document already created");
            }
        })

    },
    createNewVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender) {
        // answer choice will be either 0 or 1, if it's 1 then thats the answer they selected, 
        // i.e ansChoice1 =0 , ansChoice2 =0, ansChoice3 =1, ansChoice4 =0 means they voted for ansChoice3
        //  NOTE:  Only one ansChoiceX paramater passed in should be 1, the others should ALL be 0
        try {
            if (arguments.length != 7) {
                throw new Error("The number of argument is wrong");
            }
            if (typeof pollId != 'string') {
                throw new Error("pollId should be string");
            }
            if (typeof ansChoice1 != 'number' || typeof ansChoice2 != 'number' || typeof ansChoice3 != 'number' || typeof ansChoice4 != 'number') {
                throw new Error("ansChoice should be number");
            }
            if (typeof userId != 'string') {
                throw new Error("userId should be string");
            }

            let ansChoice1TotalVotesMale = 0;
            let ansChoice2TotalVotesMale = 0;
            let ansChoice3TotalVotesMale = 0;
            let ansChoice4TotalVotesMale = 0;
            let ansChoice1TotalVotesFemale = 0;
            let ansChoice2TotalVotesFemale = 0;
            let ansChoice3TotalVotesFemale = 0;
            let ansChoice4TotalVotesFemale = 0;

            //this is to see which answer choice has the value of 1, from here we would then find the users's gender and then set the count to 1
            // if user is M set ansChoiceXTotalVotesMale = 1 else set ansChoiceXTotalVotesFemale = 1
            switch (1) {
                case ansChoice1:

                    if (userGender == "M") {
                        ansChoice1TotalVotesMale = 1;
                    } else {
                        ansChoice1TotalVotesFemale = 1;
                    }
                    break;
                case ansChoice2:
                    if (userGender == "M") {
                        ansChoice2TotalVotesMale = 1;
                    } else {
                        ansChoice2TotalVotesFemale = 1;
                    }
                    break;
                case ansChoice3:
                    if (userGender == "M") {
                        ansChoice3TotalVotesMale = 1;
                    } else {
                        ansChoice3TotalVotesFemale = 1;
                    }
                    break;
                case ansChoice4:
                    if (userGender == "M") {
                        ansChoice4TotalVotesMale = 1;
                    } else {
                        ansChoice4TotalVotesFemale = 1;
                    }
                    break;
            }
            return votesAndMetrics().then((voteCollection) => {
                let newVote = {
                    _id: pollId,
                    totalVotesForPoll: 1,
                    ansChoice1: { totalVotes: ansChoice1, totalVotesMale: ansChoice1TotalVotesMale, totalVotesFemale: ansChoice1TotalVotesFemale },
                    ansChoice2: { totalVotes: ansChoice2, totalVotesMale: ansChoice2TotalVotesMale, totalVotesFemale: ansChoice2TotalVotesFemale },
                    ansChoice3: { totalVotes: ansChoice3, totalVotesMale: ansChoice3TotalVotesMale, totalVotesFemale: ansChoice3TotalVotesFemale },
                    ansChoice4: { totalVotes: ansChoice4, totalVotesMale: ansChoice4TotalVotesMale, totalVotesFemale: ansChoice4TotalVotesFemale },
                };
                return voteCollection.insertOne(newVote).then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                }).then((newId) => {
                    return this.getVotesForPoll(newId);
                }).then((newId) => {
                    console.log(userId + ":" + newId._id);
                    return users.addPollVotedInToUser(userId, newId._id)
                });
            });
        } catch (e) {
            console.log(e);
        }
    },
    removeVote(id) {
        return votesAndMetrics().then((voteCollection) => {
            return voteCollection
                .removeOne({ _id: id })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw (`Could not delete vote with id of ${id}`)
                    } else { }
                });
        });
    },
   //Needs testing and most likely modification
    updateVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender) {
        return polls.getPollById(pollId).then((poll)=>{
            var totalVotesForPoll = poll.totalVotesForPoll + 1;
            var totalVotesForAnsChoice =0;
            var totalVotesMaleForAnsChoice =0;
            var totalVotesFemaleForAnsChoice =0;
            if (userGender=="M"){
                totalVotesMaleForAnsChoice =1;
            }else{
                totalVotesFemaleForAnsChoice =1;
            }
            
            switch (1){
                case ansChoice1:
                    totalVotesForAnsChoice = poll.ansChoice1.totalVotes + 1;
                    totalVotesMaleForAnsChoice += poll.ansChoice1.totalVotesMale;
                    totalVotesFemaleForAnsChoice += poll.ansChoice1.totalVotesFemale;
                    //this needs to be done
                    return voteCollection.updateOne({ _id: pollId }, {totalVotesForPoll: totalVotesForPoll, $set: { 'ansChoice1.$.totalVotes': totalVotesForAnsChoice},
                    $set: { 'ansChoice1.$.totalVotesMale': totalVotesMaleForAnsChoice},$set: { 'ansChoice1.$.totalVotesFemale': totalVotesFemaleForAnsChoice}}  ).then((result) => {
                    return this.getVoteById(id);
                    });
                  
                case ansChoice2:
                totalVotesForAnsChoice = poll.ansChoice2.totalVotes + 1;
                    totalVotesMaleForAnsChoice += poll.ansChoice2.totalVotesMale;
                    totalVotesFemaleForAnsChoice += poll.ansChoice2.totalVotesFemale;
                    //this needs to be done
                    return voteCollection.updateOne({ _id: pollId }, {totalVotesForPoll: totalVotesForPoll, $set: { 'ansChoice2.$.totalVotes': totalVotesForAnsChoice},
                    $set: { 'ansChoice2.$.totalVotesMale': totalVotesMaleForAnsChoice},$set: { 'ansChoice2.$.totalVotesFemale': totalVotesFemaleForAnsChoice}}  ).then((result) => {
                    return this.getVoteById(id);
                    });
                
                case ansChoice3:
                 totalVotesForAnsChoice = poll.ansChoice3.totalVotes + 1;
                    totalVotesMaleForAnsChoice += poll.ansChoice3.totalVotesMale;
                    totalVotesFemaleForAnsChoice += poll.ansChoice3.totalVotesFemale;
                    //this needs to be done
                    return voteCollection.updateOne({ _id: pollId }, {totalVotesForPoll: totalVotesForPoll, $set: { 'ansChoice3.$.totalVotes': totalVotesForAnsChoice},
                    $set: { 'ansChoice3.$.totalVotesMale': totalVotesMaleForAnsChoice},$set: { 'ansChoice3.$.totalVotesFemale': totalVotesFemaleForAnsChoice}}  ).then((result) => {
                    return this.getVoteById(id);
                    });

                case ansChoice4:
                 totalVotesForAnsChoice = poll.ansChoice4.totalVotes + 1;
                    totalVotesMaleForAnsChoice += poll.ansChoice4.totalVotesMale;
                    totalVotesFemaleForAnsChoice += poll.ansChoice4.totalVotesFemale;
                    //this needs to be done
                  return voteCollection.updateOne({ _id: pollId }, {totalVotesForPoll: totalVotesForPoll, $set: { 'ansChoice4.$.totalVotes': totalVotesForAnsChoice},
                    $set: { 'ansChoice4.$.totalVotesMale': totalVotesMaleForAnsChoice},$set: { 'ansChoice4.$.totalVotesFemale': totalVotesFemaleForAnsChoice}}  ).then((result) => {
                    return this.getVoteById(id);
                    });
               
            }
         })
         //.then(()=>{
        // // in this function we need to first get the document then do some checking like we did
        // // in createNewVoteDocument, then increment: the totalVotesForPoll, the totalVotes for the ansChoice the user selected 
        // // and the total vote of gender 
        // return votesAndMetrics().then((voteCollection) => {
        //     let updatedVoteData = {};
        //     if (updatedVote.tags) {
        //         updatedVoteData.tags = updatedVote.tags;
        //     }
        //     if (updatedVote.title) {
        //         updatedVoteData.title = updatedVote.title;
        //     }
        //     if (updatedVote.body) {
        //         updatedVoteData.body = updatedVote.body;
        //     }
        //     let updateCommand = {
        //         $set: updatedVoteData
        //     };
        //     return voteCollection.updateOne({ _id: id }, updateCommand).then((result) => {
        //         return this.getVoteById(id);
        //     });
        // });
        // });
    },
}

module.exports = exportedMethods;
