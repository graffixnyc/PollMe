const mongoCollections = require("../config/mongoCollections");
const votesAndMetrics = mongoCollections.votesAndMetrics;

const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getVotesByPollId(pollId) {
        return votes().then((voteCollection) => {
            return voteCollection
                .findOne({ _id: pollId })
                .then((vote) => {
                    if (!vote)
                        throw "No Votes found";
                    return vote;
                });
        });
    },
    countVote(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId) {  
        //Serach for the pollid in the votes collection, if it does not exsit then we know we need to call addNewVote to create the document
        // if it does exsit then we call update
        return votesAndMetrics.find({_id: pollId}).then((votes)=>{
            if (!votes){
                //call add new vote
            }else{
                //call update vote
            }
        });
        //return users.getUserById(userId).then((user) => {
            //{"totalVotes": { $gt: 0 }}
        //});
    },

    /*
        If there are no recorded votes so far we need to call this function which will create the vote record in mongo
        We can hard code totalVotes to 1 and the other metrics fields to 1 (i.e. Male: 1 or female: 1) since this function only gets called if there are
        no votes yet 
    */
    addNewVote(pollId, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId) {
        //Need error checking here, We also need to get the users details like gender and also update the pollsVotedIn in the users collection
        try {
            if (arguments.length != 6) {
                throw new Error("The number of argument is wrong");
            }
            if (typeof pollId != 'string') {
                throw new Error("pollId should be string");
            }
            if (typeof ansChoice1 != 'string' || typeof ansChoice2 != 'string' || typeof ansChoice3 != 'string' || typeof ansChoice4 != 'string') {
                throw new Error("ansChoice should be string");
            }
            if (typeof userId != 'string') {
                throw new Error("userId should be string");
            }

            return votes().then((voteCollection) => {
                let newVote = {
                    _id: pollId,
                    totalVotesForPoll: 1,
                    ansChoice1: {ansChoice1TotalVotes: ansChoice1TotalVotes, ansChoice1TotalVotesMale: ansChoice1TotalVotesMale, ansChoice1TotalFemale, ansChoice1TotalVotesFemale },
                    ansChoice2: {ansChoice2TotalVotes: ansChoice2TotalVotes, ansChoice2TotalVotesMale: ansChoice2TotalVotesMale, ansChoice2TotalFemale, ansChoice2TotalVotesFemale },
                    ansChoice3: {ansChoice3TotalVotes: ansChoice3TotalVotes, ansChoice3TotalVotesMale: ansChoice3TotalVotesMale, ansChoice3TotalFemale, ansChoice3TotalVotesFemale },
                    ansChoice4: {ansChoice4TotalVotes: ansChoice4TotalVotes, ansChoice4TotalVotesMale: ansChoice4TotalVotesMale, ansChoice4TotalFemale, ansChoice4TotalVotesFemale },
                };
                return voteCollection
                    .insertOne(newVote)
                    .then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    })

                    .then((newId) => {
                        return this.getVoteById(newId);
                    }).then((newId) => {
                        console.log(userId + ":" + newId._id);
                        return users.addVoteCreatedToUser(userId, newId._id)

                    });
            });
        } catch (e) {
            console.log(e);
        }
    },
    removeVote(id) {
        return votes().then((voteCollection) => {
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
    updateVote(id, updatedVote) {
        return votes().then((voteCollection) => {
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
