const usersRoutes = require("./users");
const pollsRoutes = require("./polls");
const votesRoutes = require("./votesandmetrics");
const data = require('../data');
const pollsData = data.polls;

const constructorMethod = (app) => {
    //THIS is what is causing the routes to not work right
    // app.use("/", function (request, response) {
    //     response.render("pollme/login_signup");
    // })

    app.get("/", function (request, response) {
        // need to change this to the page Haoyang and Seito create
        pollsData.getAllPolls().then((polls) => {
            response.render("pollme/home_before_login", {poll: polls});
        })
        .catch((error) => {
            response.status(500).json({error: error});
        });
    });
    
    app.use("/", usersRoutes);
    app.use("/", pollsRoutes);
    app.use("/", votesRoutes);

    app.use("*", (req, res) => {
        //res.redirect("/");
        res.render("pollme/login_signup");
    })
};

module.exports = constructorMethod;
