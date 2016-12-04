const mongoCollections = require("../config/mongoCollections");
const votesAndMetrics = mongoCollections.votesAndMetrics;

const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getVoteDocumentByPollId(pollId) {
        //console.log ("POLL ID: " + pollId)
        return votesAndMetrics().then((voteCollection) => {
            return voteCollection
                .findOne({ _id: pollId })
                .then((vote) => {
                    return vote;
                });
        });
    },
    countVote(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender) {
        //Serach for the pollid in the votes collection (since the ID is the same as the pollID that the votes belong to, 
        //if it does not exsit then we know we need to call addNewVote to create the document
        // if it does exsit then we call update
      return  this.getVoteDocumentByPollId(pollId).then((poll) =>{
             if (!poll) {
                    this.createNewVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender);
                } else {
                    //call updateVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender)
                }
        });
    },

    /*  If there are no recorded votes so far we need to call this function which will create the votesAndMetrics document in mongo
        We can hard code totalVotes to 1 and the other metrics fields to 1 (i.e. Male: 1 or female: 1) since this function only gets called if there are
        no votes yet on a poll
    */
    createNewVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender) {
        // answer choice will be either 0 or 1, if it's 1 then thats the answer they selected, 
        // i.e ansChoice1 =0 , ansChoice2 =0, ansChoice3 =1, ansChoice4 =0 means they voted for ansChoice3
        //  NOTE:  Only one ansChoiceX paramater passed in should be 1, the others should ALL be 0

        //Need error checking here
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
            switch (1) {
                case ansChoice1:
                    // if user is M set ansChoice1TotalVotesMale = 1 else set ansChoice1TotalVotesFemale = 1
                    if (userGender == "M") {
                        ansChoice1TotalVotesMale = 1;
                    } else {
                        ansChoice1TotalVotesFemale = 1;
                    }
                    break;
                case ansChoice2:
                    // if user is M set ansChoice2TotalVotesMale = 1 else set ansChoice2TotalVotesFemale = 1
                    if (userGender == "M") {
                        ansChoice2TotalVotesMale = 1;
                    } else {
                        ansChoice2TotalVotesFemale = 1;
                    }
                    break;
                case ansChoice3:
                    // if user is M set ansChoice3TotalVotesMale = 1 else set ansChoice3TotalVotesFemale = 1
                    if (userGender == "M") {
                        ansChoice3TotalVotesMale = 1;
                    } else {
                        ansChoice3TotalVotesFemale = 1;
                    }
                    break;
                case ansChoice4:
                    // if user is M set ansChoice4TotalVotesMale = 1 else set ansChoice4TotalVotesFemale = 1
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
                return voteCollection
                    .insertOne(newVote)
                    .then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    })

                    .then((newId) => {
                        return this.getVoteDocumentByPollId(newId);
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

    // This function should get called if there is already a vote record crested for the poll to update the total votes
    // and demographics  Haven't started this yet
    updateVoteDocument(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId, userGender) {
        // in this function we need to first get the document then do some checking like we did
        // in createNewVoteDocument, then increment the totalVotesForPoll, the totalVotes for that ansChoice 
        // and the total vote of gender 
        return votesAndMetrics().then((voteCollection) => {
            let updatedVoteData = {};

            if (updatedVote.tags) {
                updatedVoteData.tags = updatedVote.tags;
            }

            if (updatedVote.title) {
                updatedVoteData.title = updatedVote.title;
            }

            if (updatedVote.body) {
                updatedVoteData.body = updatedVote.body;
            }

            let updateCommand = {
                $set: updatedVoteData
            };

            return voteCollection.updateOne({
                _id: id
            }, updateCommand).then((result) => {
                return this.getVoteById(id);
            });
        });
    },
}

module.exports = exportedMethods;
