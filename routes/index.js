const usersRoutes = require("./users");
const pollsRoutes = require("./polls");

const constructorMethod = (app) => {
    app.use("/", usersRoutes);
    app.use("/", pollsRoutes);

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;
