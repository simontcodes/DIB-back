const express = require("express");
const router = express.Router();

//Mongoose Models
const Admin = require("../models/Admin");
const User = require("../models/User");

// Log in for admin
router.post("/admins", async (req, res) => {
  //Admin.login is a method of the User model
  Admin.login(req.body.email, req.body.password, (err, token, message) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!token) {
      return res.status(401).send(message);
    }

    res.send({ token: token });
  });
});

//Log in for dibs
router.post("/dibs", async (req, res) => {
  //User.login is a method of the User model
  User.login(req.body.email, req.body.password, (err, token, user, message) => {
    if (err) {
      return res.status(500).send(err);
    }

    // if (!token) {
    //   return res.status(401).send(message);
    // }

    res.send({ 
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
});

module.exports = router;
