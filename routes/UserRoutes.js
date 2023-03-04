const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

//Mongoose Model
const User = require("../models/User");

//Auth use for all the necessary routes
const authenticateJWT = require("../middleware/auth");

// POST Route to create a new user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update password for a user
router.patch("/update-password", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).send({ error: "No user found with that id" });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      return res.status(400).send({ error: "Current password is incorrect" });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();

    res.send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Recover password for a user

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.sendPasswordResetEmail();

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific user
router.get("/:id", authenticateJWT, async (req, res) => {
  //findById is a method defined in the User model
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  });
});

// Update a specific user
router.patch("/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a specific user
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//routes to use with the reset token method
// router.get('/users/reset/:token', (req, res) => {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
//     if (err) { return res.status(500).send(err); }
//     if (!user) { return res.status(401).send('Password reset token is invalid or has expired'); }
//     res.render('reset', { token: req.params.token });
//   });
// });

// router.post('/users/reset/:token', (req, res) => {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
//     if (err) { return res.status(500).send(err); }
//     if (!user) { return res.status(401).send('Password reset token is invalid or has expired'); }
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//       if (err) { return res.status(500).send(err); }
//       user.password = hash;
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;
//       user.save((err) => {
//         if (err) { return res.status(500).send(err); }
//         res.send('Password has been reset');
//       });
//     });
//   });
// });

module.exports = router;
