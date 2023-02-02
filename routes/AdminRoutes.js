const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Mongoose Model
const Admin = require("../models/Admin");

// Create an admin
router.post("/", async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).send(admin);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login an admin
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    res.send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update password for an admin
router.patch("/updatepassword", async (req, res) => {
  try {
    const admin = await Admin.findById(req.body.id);
    if (!admin) {
      return res.status(400).send({ error: "No admin found with that id" });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      admin.password
    );
    if (!isMatch) {
      return res.status(400).send({ error: "Current password is incorrect" });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(req.body.newPassword, salt);
    await admin.save();

    res.send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Recover password for an admin
router.post("/recover", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res
        .status(400)
        .send({ error: "No admin found with that email address" });
    }
    // Generate a new password and send it to the admin's email
    const newPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

    const msg = {
      to: admin.email,
      from: "youremail@example.com",
      subject: "Password reset",
      text: `Your new password is: ${newPassword}`,
    };

    sgMail.send(msg, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to send password reset email" });
      } else {
        console.log(result);
        res.send({ message: "Password successfully reset and sent to email" });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
//Note: Replace YOUR_SENDGRID_API_KEY and youremail@example.com with your actual SendGrid API key and email address in the code.

// Get all admins
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific admin
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific admin
router.patch("/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a specific admin
router.delete("/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
