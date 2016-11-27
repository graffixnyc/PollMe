const mongoCollections = require("../config/mongoCollections");
const votesAndMetrics =mongoCollections.votesAndMetrics;

const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getVotesByPollId(pollId) {
        return votes().then((voteCollection) => {
            return voteCollection
                .findOne({_id: pollId})
                .then((vote) => {
                    if (!vote) 
                        throw "Poll not found";
                    return vote;
                });
        });
    },
    countVote(pollId,ansChoice1,ansChoice2,ansChoice3,ansChoice4,userId ) {
        // First we need to get the user's information like gender and age, then we need to see if votes for this poll already exsist, 
        // if so then we need to update by calling updateVote, 
        // if not then we need to create a new record to hold the votes by calling addNewVote. 
        // then we need to update the user collection pollsVotedIn 
    },
    addNewVote(pollId,ansChoice1,ansChoice2,ansChoice3,ansChoice4,userId ) {
        //Need error checking here
        return votes().then((voteCollection) => {
                let newVote = {
                    _id: pollId,
                    category: category,
                    postedDate: postedDate,
                    question: question,
                    ansChoice1: [],
                    ansChoice2: [],
                    ansChoice3: [],
                    ansChoice4: [],
                    };
                    return voteCollection
                        .insertOne(newVote)
                        .then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        })
                        
                        .then((newId) => {
                            return this.getVoteById(newId);
                        }).then((newId) =>{
                            console.log (userId + ":" + newId._id);     
                            return users.addVoteCreatedToUser(userId,newId._id)
                            
                        });
        });
    },
    removeVote(id) {
        return votes().then((voteCollection) => {
            return voteCollection
                .removeOne({_id: id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete vote with id of ${id}`)
                    } else {}
                });
        });
    },
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
    changeCategory(oldCategory, newCategory) {
        let findDocuments = {
            category: oldCategory
        };

        let firstUpdate = {
            $pull: oldCategory
        };

        let secondUpdate = {
            $addToSet: newCategory
        };

        return voteCollection
            .updateMany(findDocuments, firstUpdate)
            .then((result) => {
                return voteCollection.updateMany(findDocuments, secondUpdate);
            })
            .then((secondUpdate) => {
                return this.getVotesByCategory(newCategory);
            });
    }
}

module.exports = exportedMethods;