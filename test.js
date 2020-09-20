const mongoose = require("mongoose");
const Users = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1/testdb", {
    // ^ mongodb://localhost:27017/testdb
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB ready");

    // find all users whose name contain 'ola'
    Users.findUsersByName("ola")
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(`Error: ${err}`);
      });

    // introduce each user
    Users.find()
      .then(users => {
        users.forEach(user => {
          user.introduce();
        });
      })
      .catch(error => {
        console.log(error);
        console.log("error finding user to introduce");
      });
  })
  .catch(e => {
    console.log(e);
    console.log("Failed to set up mongoose database");
  });
