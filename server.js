const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const app = express();
const port = 2002;

mongoose
  .connect("mongodb://127.0.0.1:27017/REST", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

app.use(express.json());

// GET all users
app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error fetching users from the database" });
    });
});

// POST a new user
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  const newUser = new User({ name, email, age });

  newUser
    .save()
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Error adding a new user to the database" });
    });
});

// PUT to edit a user by ID
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  User.findByIdAndUpdate(id, { name, email, age }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Error updating the user in the database" });
    });
});

// DELETE a user by ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  User.findByIdAndRemove(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Error deleting the user from the database" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
