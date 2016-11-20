const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";

                return user;
            });
        });
    },
    addUser(firstName, lastName, email, gender, city, state, age, hashedPassword) {
        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                city: city,
                state: state,
                age: age,
                hashedPassword: hashedPassword,
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
    removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },
    updateUser(id, updatedUser) {
        return this.getUserById(id).then((currentUser) => {
            let updatedUser = {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: upatedUser.email,
                gender: upatedUser.gender,
                city: updateUser.city,
                state: upatedUser.state,
                age: upatedUser.age,
                hashedPassword: upatedUser.hashedPassword
            };

            let updateCommand = {
                $set: updatedUser
            };

            return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
                return this.getUserById(id);
            });
        });
    },
    addPollCreatedToUser(userId, pollId) {
        return this.getUserById(userId).then((currentUser) => {

            return userCollection.updateOne({ _id: id }, {
                $addToSet: {
                    pollsCreated: {
                        pollId: pollId
                    }
                }
            });
        });
    },
    addPollVotedInToUser(userId, pollId) {
        return this.getUserById(userId).then((currentUser) => {

            return userCollection.updateOne({ _id: id }, {
                $addToSet: {
                    pollsVotedIn: {
                        pollId: pollId
                    }
                }
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
    }
}

module.exports = exportedMethods;