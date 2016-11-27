const mongoCollections = require("../config/mongoCollections");
const polls = mongoCollections.polls;
const users = require("./users");
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
            return Promise.reject("No tag provided");
        
        return polls().then((pollCollection) => {
            return pollCollection
                .find({category: category})
                .toArray();
        });
    },
    getPollById(id) {
        return polls().then((pollCollection) => {
            return pollCollection
                .findOne({_id: id})
                .then((poll) => {
                    if (!poll) 
                        throw "Poll not found";
                    return poll;
                });
        });
    },
    addPoll(category, postedDate, question, ansChoice1,ansChoice2,ansChoice3,ansChoice4,userId ) {
        if (typeof title !== "string") 
            return Promise.reject("No title provided");
        if (typeof body !== "string") 
            return Promise.reject("I aint got nobody!");

        if (!Array.isArray(tags)) {
            tags = [];
        }
        
        return polls().then((pollCollection) => {
            return users
                .getUserById(userId)
                .then((userThatPolled) => {
                    let newPoll = {
                        _id: uuid.v4(),
                        category: category,
                        postedDate: postedDate,
                        question: question,
                        ansChoice1: ansChoice1,
                        ansChoice2: ansChoice2,
                        ansChoice3: ansChoice3,
                        ansChoice4: ansChoice4,
                        comments: []
                    };

                    return pollCollection
                        .insertOne(newPoll)
                        .then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        })
                        .then((newId) => {
                            return this.getPollById(newId);
                        });
                });
        });
    },
    removePoll(id) {
        return polls().then((pollCollection) => {
            return pollCollection
                .removeOne({_id: id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete poll with id of ${id}`)
                    } else {}
                });
        });
    },
    updatePoll(id, updatedPoll) {
        return polls().then((pollCollection) => {
            let updatedPollData = {};

            if (updatedPoll.tags) {
                updatedPollData.tags = updatedPoll.tags;
            }

            if (updatedPoll.title) {
                updatedPollData.title = updatedPoll.title;
            }

            if (updatedPoll.body) {
                updatedPollData.body = updatedPoll.body;
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
    },
    renameCategory(oldCategory, newCategory) {
        let findDocuments = {
            tags: oldCategory
        };

        let firstUpdate = {
            $pull: oldCategory
        };

        let secondUpdate = {
            $addToSet: newCategory
        };

        return pollCollection
            .updateMany(findDocuments, firstUpdate)
            .then((result) => {
                return pollCollection.updateMany(findDocuments, secondUpdate);
            })
            .then((secondUpdate) => {
                return this.getPollsByCategory(newCategory);
            });
    }
}

module.exports = exportedMethods;