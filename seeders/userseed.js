require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
//the json file with all the example users
const users = require("./users.json");

mongoose
  .connect(
    "for some reason this only takes the actual string and not the .env var",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Connected to database");

    // Remove all existing users
    User.deleteMany({})
      .then(() => {
        console.log("Removed existing users");

        // Insert new users
        User.insertMany(users)
          .then(() => {
            console.log("Inserted new users");
            process.exit();
          })
          .catch((err) => {
            console.error(err);
            process.exit(1);
          });
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
