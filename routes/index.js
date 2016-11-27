//const userRoutes = require("./users");

const constructorMethod = (app) => {
    //app.use("/", userRoutes);

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;
