const sequelize = require("sequelize");

const connection = new sequelize("guiaperguntas", "root", "Alexbonito123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
