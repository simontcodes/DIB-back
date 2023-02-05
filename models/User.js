require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

//use by the get by id route
UserSchema.statics.findById = function (id, callback) {
  return this.findOne({ _id: id }, callback);
};

//used for the login route
UserSchema.statics.login = function (email, password, callback) {
  this.findOne({ email: email }, (err, user) => {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(null, null, { message: "Incorrect email or password" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return callback(err);
      }

      if (!result) {
        return callback(null, null, { message: "Incorrect email or password" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      callback(null, token);
    });
  });
};

//method to recover a password
//need to write routes that use this method
UserSchema.methods.recoverPassword = function (callback) {
  const user = this;
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  user.save((err) => {
    if (err) {
      return callback(err);
    }
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: "noreply@example.com",
      subject: "Password Recovery",
      text: `Use the following token to reset your password: ${resetToken}`,
      html: `<p>Use the following token to reset your password: ${resetToken}</p>`,
    };
    sendgrid.send(msg, (err) => {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
  });
};
module.exports = User = mongoose.model("users", UserSchema);
