const indexR = require("./index");
const usersR = require("./users");
const adminR = require("./admin");
const expensesR = require("./expenses");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/admin",adminR);
  app.use("/expenses",expensesR);
}