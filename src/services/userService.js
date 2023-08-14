const User = require("../models/userModel");

class Users {
  async createUser(email, firstName, lastName, password) {
    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
    });
    return user;
  }

  async addUser(user) {
    const newUser = await User.create(user);
    return newUser;
  }

  async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }
}

const users = new Users();
module.exports = users;
