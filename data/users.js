const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');

let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) reject("User not found");

                return user;
            });
        });
    },
    checkLogin(email, hashedPassword) {
        return users().then((userCollection) => {
            return userCollection.findOne({ $and: [{ email: email }, { hashedPassword: hashedPassword }] }).then((user) => {
                if (!user) reject("User not found Or Login Incorrect");

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
    addPollVotedInToUser(userId, pollId) {
        return users().then((userCollection) => {
            return this.getUserById(userId).then((currentUser) => {
                return userCollection.updateOne({ _id: userId }, {
                    $addToSet: {
                        pollsVotedIn: {
                            pollId: pollId
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