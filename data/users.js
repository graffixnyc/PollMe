const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
//const votesCollection = mongoCollections.votesAndMetrics;
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');
//const polls = require("./polls");
//const votesAndMetrics = require("./votesandmetrics");
//const votesAndMetrics = require("./votesandmetrics");
let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) return Promise.reject("User not found");

                return user;
            });
        });
    },
    getUserByUsername(username) {
        return users().then((userCollection) => {
            return userCollection.findOne({ username: username }).then((user) => {
                return user;
            });
        });
    },
    addUser(username, firstName, lastName, email, gender, city, state, age, hashedPassword) {
        //need error checking here

        if (username === undefined || username === "") return Promise.reject("No username given");
        if (firstName === undefined || firstName === "") return Promise.reject("No first name given");
        if (lastName === undefined || lastName === "") return Promise.reject("No last name given");
        if (email === undefined || email === "") return Promise.reject("No email given");
        if (gender === undefined || gender === "") return Promise.reject("No gender given");
        if (city === undefined || city === "") return Promise.reject("No city given");
        if (state === undefined || state === "") return Promise.reject("No state given");
        if (age === undefined || age === "") return Promise.reject("No age given");
        if (hashedPassword === undefined || hashedPassword === "") return Promise.reject("No password given");

        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                city: city,
                state: state,
                age: age,
                password: hashedPassword,
                pollsCreated: [],
                pollsVotedIn: []
            };
            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });

    },

    createHashedPassword(password) {
        return new Promise((fulfill, reject) => {
            if (!password) reject("Password not given");
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) reject(err);
                    fulfill(hash);
                });
            });
        });

    },

    removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },
    //THIS FUNCTION NOT DONE YET
    updateUser(id, updatedUser) {
        return this.getUserById(id).then((currentUser) => {
            if (currentUser.gender != updatedUser) {
                //get votes for polls they voted in deincrement the total votes for the gener they were
                //and then increment the total number of votes for their new gender.  
                let pollsVotedIn = currentUser.pollsVotedIn;
                console.log(pollsVotedIn.length);

                for (let i = 0; i < pollsVotedIn.length; i++) {
                    let ansChoiceSelected = pollsVotedIn[i].ansChoiceSelected
                    let pollId = pollsVotedIn[i].pollId
                    //console.log(`Poll ID: ${pollId}, ansChoiceSelected: ${ansChoiceSelected} `)
                    votesAndMetrics.getVotesForPoll(pollId).then((votes) => {
                        let totalVotesForPoll = votes.totalVotesForPoll;
                        let totalMaleVotesForAnsChoice1 = votes.ansChoice1.totalVotesMale;
                        let totalMaleVotesForAnsChoice2 = votes.ansChoice2.totalVotesMale;
                        let totalMaleVotesForAnsChoice3 = votes.ansChoice3.totalVotesMale;
                        let totalMaleVotesForAnsChoice4 = votes.ansChoice4.totalVotesMale;//votes.ansChoice4.totalVotesMale;
                        let totalFemaleVotesForAnsChoice1 = votes.ansChoice1.totalVotesFemale;
                        let totalFemaleVotesForAnsChoice2 = votes.ansChoice2.totalVotesFemale;
                        let totalFemaleVotesForAnsChoice3 = votes.ansChoice3.totalVotesFemale;
                        let totalFemaleVotesForAnsChoice4 = votes.ansChoice4.totalVotesFemale;
                        if (updatedUser == "F") {
                            console.log("changed to f " + ansChoiceSelected);
                            switch (ansChoiceSelected) {
                                case "ansChoice1":
                                    totalFemaleVotesForAnsChoice1 = votes.ansChoice1.totalVotesFemale + 1;
                                    totalMaleVotesForAnsChoice1 = votes.ansChoice1.totalVotesMale - 1;
                                    //votesAndMetrics.updateOne({ _id: id }, {totalVotesMale: totalMaleVotesForAnsChoice1},{totalVotesMale: totalMaleVotesForAnsChoice1} )
                                    break;
                                case "ansChoice2":
                                    totalFemaleVotesForAnsChoice2 = votes.ansChoice2.totalVotesFemale + 1;
                                    totalMaleVotesForAnsChoice2 = votes.ansChoice2.totalVotesMale - 1;
                                    break;
                                case "ansChoice3":
                                    totalFemaleVotesForAnsChoice3 = votes.ansChoice3.totalVotesFemale + 1;
                                    totalMaleVotesForAnsChoice3 = votes.ansChoice3.totalVotesMale - 1;
                                    break;
                                case "ansChoice4":
                                    totalFemaleVotesForAnsChoice4 = votes.ansChoice4.totalVotesFemale + 1;
                                    totalMaleVotesForAnsChoice4 = votes.ansChoice4.totalVotesMale - 1;
                                    break;

                            }
                        } else {
                            console.log("changed to M");
                            switch (ansChoiceSelected) {
                                case "ansChoice1":
                                    totalFemaleVotesForAnsChoice1 = votes.ansChoice1.totalVotesFemale - 1;
                                    totalMaleVotesForAnsChoice1 = votes.ansChoice1.totalVotesMale + 1;
                                    break;
                                case "ansChoice2":
                                    totalFemaleVotesForAnsChoice2 = votes.ansChoice2.totalVotesFemale - 1;
                                    totalMaleVotesForAnsChoice2 = votes.ansChoice2.totalVotesMale + 1;
                                    break;
                                case "ansChoice3":
                                    totalFemaleVotesForAnsChoice3 = votes.ansChoice3.totalVotesFemale - 1;
                                    totalMaleVotesForAnsChoice3 = votes.ansChoice3.totalVotesMale + 1;
                                    break;
                                case "ansChoice4":
                                    totalFemaleVotesForAnsChoice4 = votes.ansChoice4.totalVotesFemale - 1;
                                    totalMaleVotesForAnsChoice4 = votes.ansChoice4.totalVotesMale + 1;
                                    break;
                            }
                        }
                        console.log(`Poll id ${pollId} Male: ${totalMaleVotesForAnsChoice1}, ${totalMaleVotesForAnsChoice2}, ${totalMaleVotesForAnsChoice3}, ${totalMaleVotesForAnsChoice4}`)
                        console.log(`Poll id ${pollId} FeMale: ${totalFemaleVotesForAnsChoice1}, ${totalFemaleVotesForAnsChoice2}, ${totalFemaleVotesForAnsChoice3}, ${totalFemaleVotesForAnsChoice4}`)
                       
                        //Now need to somehow call the update votes
                        // votesAndMetrics.updateOne({ _id: pollId }, {$set: { 'ansChoice1.$.totalVotesMale': totalMaleVotesForAnsChoice1 }, 
                        // $set: { 'ansChoice2.$.totalVotesMale': totalMaleVotesForAnsChoice2 },$set: { 'ansChoice3.$.totalVotesMale': totalMaleVotesForAnsChoice3 },
                        // $set: { 'ansChoice4.$.totalVotesMale': totalMaleVotesForAnsChoice4 },$set: { 'ansChoice1.$.totalVotesFeMale': totalFemaleVotesForAnsChoice1 }, 
                        // $set: { 'ansChoice2.$.totalVotesFemale': totalFemaleVotesForAnsChoice2 },$set: { 'ansChoice3.$.totalVotesFemale': totalFemaleVotesForAnsChoice3 },$set: { 'ansChoice4.$.totalVotesFemale': totalFemaleVotesForAnsChoice4 }} )
                       
                        
                        //console.log(`ansChoice1: ${totalVotesForAnsChoice1} ansChoice2: ${totalVotesForAnsChoice2} ansChoice3: ${totalVotesForAnsChoice3} ansChoice4: ${totalVotesForAnsChoice4}`)
                        //console.log(ansChoiceSelected);
                    })
                }
                // })
            }
            //     let updatedUser = {
            //         firstName: updatedUser.firstName,
            //         lastName: updatedUser.lastName,
            //         email: upatedUser.email,
            //         gender: upatedUser.gender,
            //         city: updateUser.city,
            //         state: upatedUser.state,
            //         age: upatedUser.age,
            //         hashedPassword: upatedUser.hashedPassword
            //     };

            //     let updateCommand = {
            //         $set: updatedUser
            //     };

            //     return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
            //         return this.getUserById(id);
            //     });
        });
    },
    addPollCreatedToUser(userId, pollId) {
        return users().then((userCollection) => {
            return this.getUserById(userId).then((currentUser) => {
                return userCollection.updateOne({ _id: userId }, {
                    $push: {
                        pollsCreated: {
                            pollId: pollId
                        }
                    }
                });
            });
        });
    },
    addPollVotedInToUser(userId, pollId, ansChoiceUserSelected) {
        return users().then((userCollection) => {
            return this.getUserById(userId).then((currentUser) => {
                return userCollection.updateOne({ _id: userId }, {
                    $addToSet: {
                        pollsVotedIn: {
                            pollId: pollId,
                            ansChoiceSelected: ansChoiceUserSelected
                        }
                    }
                });
            });
        });
    },
    removePollFromUser(userId, pollId) {
        return this.getUserById(userId).then((currentUser) => {
            return userCollection.updateOne({ _id: id }, {
                $pull: {
                    pollsCreated: {
                        pollId: pollId
                    }
                }
            });
        });
    },
    getPollsUserVotedin(userId) {
        if (!userId)
            return Promise.reject("No userId provided");

        return this.getUserById(userId).then((user) => {
            var pollsVotedIn = user.pollsVotedIn;
            console.log(pollsVotedIn.length)

        });

    },

    isPasswordValid(user, password) {
        return new Promise((fulfill, reject) => {
            if (!user) reject("User not given");
            if (!password) reject("Password not given");
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) reject(err);
                fulfill(res);
            });

        });

    }
}

module.exports = exportedMethods;

const polls = require("./polls");
const votesAndMetrics = require("./votesandmetrics");