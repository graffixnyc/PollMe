const usersRoutes = require("./users");
const pollsRoutes = require("./polls");

const constructorMethod = (app) => {
    app.use("/", function (request, response) {
        response.render("pollme/login_signup");
    })
    
    app.use("/", usersRoutes);
    app.use("/", pollsRoutes);

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;
