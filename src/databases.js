const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("Node Databases", "root", "mypassword", {
  host: "localhost",
  port: "3406",
  dialect: "mysql",
});

module.exports = { sequelize, DataTypes };
