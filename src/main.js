const express = require("express");
const makeStoppable = require("stoppable");
const http = require("http");
const { check, validationResult } = require("express-validator");
const Users = require("./services/userService");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./services/authMiddleware");
const routes = require("../routes");
const app = express();

const server = makeStoppable(http.createServer(app));
app.use("/assets", express.static(__dirname + "/assets"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set(
  "views",
  "C:/Users/lenovo/Desktop/simple-to-do-aplication-master - Copy (2)/views"
);
const SECRET_KEY = "Secret Key";
const validation = [
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
];

// Middleware to check JWT token

app.use("/", routes());
// User registration route
app.post("/api/register", validation, (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  // Check if a user with the same email already exists
  const existingUser = Users.getUserByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }

  // Create a new user object
  const newUser = {
    email,
    password,
    firstName,
    lastName,
  };

  // Add the new user to the users list
  Users.addUser(newUser);

  // Return a success response
  res.status(200).json({ message: "User registered successfully" });
});
app.post("/api/login", validation, (req, res) => {
  const { email, password } = req.body;

  // Check if a user with the provided email exists
  const existingUser = Users.getUserByEmail(email);
  if (!existingUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Check if the provided password matches the stored password
  if (existingUser.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // If the user exists and the password is correct, create a JWT token
  const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
    expiresIn: "24h", // Token will expire in 1 hour
  });
  // Return the token as a response

  res.status(200).json({ token });
});

module.exports = () => {
  const stopServer = () => {
    return new Promise((resolve) => {
      server.stop(resolve);
    });
  };

  return new Promise((resolve) => {
    server.listen(3000, () => {
      console.log("Express server is listening on http://localhost:3000");
      resolve(stopServer);
    });
  });
};
