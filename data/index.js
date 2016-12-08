const users = require("./users");
const polls = require("./polls")
const votesAndMetrics = require("./votesandmetrics")

const constructorMethod = (app) => {
    app.use("/users", users);
    app.use("/polls", polls);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};
module.exports = constructorMethod;
