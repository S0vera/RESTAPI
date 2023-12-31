const express = require("express");
const makeStoppable = require("stoppable");
const http = require("http");
const { check, validationResult } = require("express-validator");
const Users = require("./models/userModel");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./services/authMiddleware");
const routes = require("../routes");
const app = express();
const { sequelize } = require("./databases");

sequelize
  .sync()
  .then(() => {
    console.log("Connected to MySQL");
  })
  .catch((err) => console.error("Connection error", err));
// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:37017/your_database_name", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Connection error", err));

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

app.use(routes());
// User registration route
app.post("/api/register", validation, async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create a new user object
    const newUser = await Users.create({
      email,
      password, // Note: You should hash the password before saving it
      firstName,
      lastName,
    });

    // Return a success response
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

app.post("/api/login", validation, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the provided email exists
    const existingUser = await Users.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the stored password
    // Note: You should use a hashing library like bcrypt to compare hashed passwords
    if (existingUser.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If the user exists and the password is correct, create a JWT token
    const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
      expiresIn: "24h", // Token will expire in 24 hours
    });

    // Return the token as a response
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
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
