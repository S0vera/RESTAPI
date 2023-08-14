const { sequelize, DataTypes } = require("../databases");

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Email is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Synchronize the model with the database
User.sync();

module.exports = User;
