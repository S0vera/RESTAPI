class Users {
  constructor() {
    this.users = [];
  }
  createUser(email, firstName, lastName, password) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }

  addUser(user) {
    this.users.push(user);
  }

  getUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }
}

const users = new Users();
module.exports = users;
