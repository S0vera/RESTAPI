const User = require("../models/userModel");

class Users {
  async createUser(email, firstName, lastName, password) {
    const user = new User({
      email,
      firstName,
      lastName,
      password,
    });
    await user.save();
  }

  async addUser(user) {
    await User.create(user);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }
}

const users = new Users();
module.exports = users;
