const usersRoutes = require("./users");
const pollsRoutes = require("./polls");
const votesRoutes = require("./votesandmetrics");

const constructorMethod = (app, passport) => {
    //THIS is what is causing the routes to not work right
    // app.use("/", function (request, response) {
    //     response.render("pollme/login_signup", {message: request.flash('loginMessage')});
    // })
    
    app.use("/", usersRoutes);
    app.use("/", pollsRoutes);
    app.use("/", votesRoutes);

    app.use("*", (req, res) => {
        //res.redirect("/");
        res.render("pollme/login_signup", {message: request.flash('loginMessage')});
    })
};

module.exports = constructorMethod;
