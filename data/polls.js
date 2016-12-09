const mongoCollections = require("../config/mongoCollections");
const polls = mongoCollections.polls;
const users = require("./users");
const votesAndMetrics = require("./votesandmetrics");
const uuid = require('node-uuid');

let exportedMethods = {
    getAllPolls() {
        return polls().then((pollCollection) => {
            return pollCollection
                .find({})
                .toArray();
        });
    },
    getPollsByCategory(category) {
        if (!category)
            return Promise.reject("No category provided");

        return polls().then((pollCollection) => {

            return pollCollection
                .find({ category: category })
                .toArray();
        });

    },
    searchPollsByKeyword(query) {
        if (!query)
            return Promise.reject("No search term given");
        return polls().then((pollCollection) => {
            var regex = new RegExp([".*", query, ".*"].join(""), "i");
            console.log(regex)
            return pollCollection
                .find({ $or: [{ "question": regex }, { "category": regex }, { "ansChoice1": regex }, { "ansChoice2": regex }, { "ansChoice3": regex }, { "ansChoice4": regex }] })
                .toArray();
        });

    },
    searchPollsByKeywordAndCategory(query, category) {
        if (!query)
            return Promise.reject("No search term given");
        if (!category)
            return Promise.reject("No category given");
        return polls().then((pollCollection) => {
            var regex = new RegExp([".*", query, ".*"].join(""), "i");
            console.log(regex)
            return pollCollection
                .find({ $and: [{ $or: [{ "question": regex }, { "category": regex }, { "ansChoice1": regex }, { "ansChoice2": regex }, { "ansChoice3": regex }, { "ansChoice4": regex }] }, { "category": category }] })
                .toArray();
        });

    },
    getPollsByUser(userId) {
        if (!userId)
            return Promise.reject("No userId provided");

        return polls().then((pollCollection) => {

            return pollCollection
                .find({ createdByUser: userId })
                .toArray();
        });

    },
    getPollById(id) {
        return polls().then((pollCollection) => {
            return pollCollection
                .findOne({ _id: id })
                .then((poll) => {
                    if (!poll) {
                        Promise.reject(new Error("No Poll found")).then(function (error) {
                            // not called
                        }, function (error) {
                            console.log(error);
                        });
                    } else {
                        return poll;
                    }
                });
        });
    },
    addPoll(category, postedDate, question, ansChoice1, ansChoice2, ansChoice3, ansChoice4, userId) {
        //Need error checking here
        try {
            if (arguments.length != 8) {
                throw new Error("The number of argument is wrong");
            }
            /*
            if (typeof category != 'string') {
                throw new Error("category should be string");
            }
            */
            if (typeof postedDate != 'string') {
                throw new Error("postedDate should be string");
            }
            if (typeof question != 'string') {
                throw new Error("question should be string");
            }
            if (typeof ansChoice1 != 'string' || typeof ansChoice2 != 'string' || typeof ansChoice3 != 'string' || typeof ansChoice4 != 'string') {
                throw new Error("ansChoice should be string");
            }
            if (typeof userId != 'string') {
                throw new Error("userId should be string");
            }

            return polls().then((pollCollection) => {
                let newPoll = {
                    _id: uuid.v4(),
                    category: category,
                    postedDate: postedDate,
                    question: question,
                    ansChoice1: ansChoice1,
                    ansChoice2: ansChoice2,
                    ansChoice3: ansChoice3,
                    ansChoice4: ansChoice4,
                    comments: [],
                    createdByUser: userId
                };
                return pollCollection
                    .insertOne(newPoll)
                    .then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    })

                    .then((newId) => {
                        console.log(newId);
                        return this.getPollById(newId);
                    }).then((poll) => {
                        console.log(userId + ":" + poll._id);
                        return users.addPollCreatedToUser(userId, poll._id)

                    });
            });
        } catch (e) {
            console.log(e);
        }
    },
    removePoll(id) {
        return polls().then((pollCollection) => {
            return pollCollection
                .removeOne({ _id: id })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw (`Could not delete poll with id of ${id}`)
                    } else { }
                });
        });
    },
    updatePoll(id, updatedPoll) {
        //Check if there are votes, if there are  then reject if not then call update
        votesAndMetrics.getVotesForPoll(id).then((votes) => {
            if (votes.totalVotesForPoll > 0) {
                return Promise.reject(new Error("Cannot Update Poll that has votes")).then(function (error) {
                    // not called
                }, function (error) {
                    console.log(error);
                    console.log(`Total Votes: ${votes.totalVotesForPoll}`);
                });
            } else {
                //This may need to be modified to work correctly
                return polls().then((pollCollection) => {
                    let updatedPollData = {};

                    if (updatedPoll.category) {
                        updatedPollData.category = updatedPoll.category;
                    }

                    if (updatedPoll.question) {
                        updatedPollData.question = updatedPoll.question;
                    }
                    if (updatedPoll.ansChoice1) {
                        updatedPollData.ansChoice1 = updatedPoll.ansChoice1;
                    }
                    if (updatedPoll.ansChoice2) {
                        updatedPollData.ansChoice2 = updatedPoll.ansChoice2;
                    }
                    if (updatedPoll.ansChoice3) {
                        updatedPollData.ansChoice3 = updatedPoll.ansChoice3;
                    }
                    if (updatedPoll.ansChoice4) {
                        updatedPollData.ansChoice4 = updatedPoll.ansChoice4;
                    }
                    let updateCommand = {
                        $set: updatedPollData
                    };

                    return pollCollection.updateOne({
                        _id: id
                    }, updateCommand).then((result) => {
                        return this.getPollById(id);
                    });
                });
            }
        });
    },
    addCommentToPoll(pollId, poster, comment) {
        return polls().then((pollCollection) => {
            return pollCollection.updateOne({ _id: pollId }, {
                $addToSet: {
                    comments: {
                        _id: uuid.v4(),
                        poster: poster,
                        comment: comment
                    }
                }
            });
        });
    },
    getAllCategories() {
        return polls().then((pollCollection) => {
           return pollCollection.distinct("category", {}, {});
        });
    }
    
}

module.exports = exportedMethods;
