const usersRoutes = require("./users");
const pollsRoutes = require("./polls");

const constructorMethod = (app) => {
    //THIS is what is causing the routes to not work right
    // app.use("/", function (request, response) {
    //     response.render("pollme/login_signup");
    // })

    app.use("/test", function (request, response) {
        response.render("pollme/single_poll");
    })
    
    app.use("/", usersRoutes);
    app.use("/", pollsRoutes);

    app.use("*", (req, res) => {
        //res.redirect("/");
        res.render("pollme/login_signup");

    })
};

module.exports = constructorMethod;
