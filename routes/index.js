const express = require("express");
const router = express.Router();
const Users = require("../models/user");

// test
router.get("/", (req, res) => {
  res.json({ done: true, message: "MongoDb server app is running" });
});

// return all users
router.get("/users", async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

// create new user
router.post("/users/add", async (req, res) => {
  let { name, email } = req.body;
  const users = new Users({
    name,
    email
  });
  await users.save().catch(e => {});
  res.json(users);
});

// get individual user
router.get("/users/:id", async (req, res) => {
  let { id } = req.params;
  let user = Users.findById(id)
    .then(user => {
      res.json(user);
      user.introduce();
    })
    .catch(e => {
      res.send(`No user matches id : '${id}'`);
    });
});

// edit user
router.patch("/users/:id", async (req, res) => {
  let { id } = req.params;
  Users.findById(id)
    .then(user => {
      let edited = [];
      for (let key in req.query) {
        edited.push(key);
        user[key] = req.query[key];
      }
      user.save();
      res.json({ done: true, edited });
    })
    .catch(e => {
      res.send(`No user matches id : '${id}'`);
    });
});

// delete user
router.delete("/users/:id", async (req, res) => {
  let { id } = req.params;
  Users.findByIdAndDelete(id)
    .then(user => {
      res.json({ done: true, deleted: id });
    })
    .catch(e => {
      res.send(`No users match id : '${id}'`);
    });
});

module.exports = router;
