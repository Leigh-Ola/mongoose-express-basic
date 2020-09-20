const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes = require("./routes/index");
require("dotenv").config();

const bodyParser = require("body-parser");
app.set("port", process.env.PORT || 3000);

let mongodb_url =
  process.env.NODE_ENV == "production"
    ? process.env.MONGO_URL
    : "mongodb://127.0.0.1/testdb";

mongoose
  .connect(mongodb_url, {
    // ^mongodb://127.0.0.1/testdb
    // ^ mongodb://localhost:27017/testdb
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
  })
  .then(() => {
    console.log("DB ready");
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    app.use("/", routes);

    app.listen(app.get("port"), () => {
      console.log(`Running mongo app server at localhost://${app.get("port")}`);
    });
  })
  .catch(e => {
    console.log(e);
    console.log("Failed to set up mongoose database");
  });
