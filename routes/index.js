const usersRoutes = require("./users");
const pollsRoutes = require("./polls");
const votesRoutes = require("./votesandmetrics");

const constructorMethod = (app) => {
    //THIS is what is causing the routes to not work right
    // app.use("/", function (request, response) {
    //     response.render("pollme/login_signup");
    // })

    app.get("/", function (request, response) {
        // need to change this to the page Haoyang and Seito create
        //response.render("pollme/login_signup", {message: request.flash('loginMessage')});
    })
    
    app.use("/", usersRoutes);
    app.use("/", pollsRoutes);
    app.use("/", votesRoutes);

    app.use("*", (req, res) => {
        //res.redirect("/");
        res.render("pollme/login_signup");
    })
};

module.exports = constructorMethod;
