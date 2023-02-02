const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
      },
      message:
        "Password must contain at least one capital letter and one number",
    },
  },
  role: {
    type: String,
    enum: [
      "Fullstack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Project Manager",
      "QA Tester",
      "UX/UI",
      "DevOps",
    ],
  },
});

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  console.log("yes it goes in here");
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = User = mongoose.model("users", UserSchema);
