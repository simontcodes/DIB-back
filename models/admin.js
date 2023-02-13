const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new Schema({
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
    enum: ["Super Admin", "Regular Admin"],
    default: "Super Admin",
  },
});

// Hash password before saving the admin
AdminSchema.pre("save", async function (next) {
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

//user for the login route
AdminSchema.statics.login = function (email, password, callback) {
  this.findOne({ email: email }, (err, admin) => {
    if (err) {
      return callback(err);
    }

    if (!admin) {
      return callback(null, null, { message: "Incorrect email or password" });
    }

    bcrypt.compare(password, admin.password, (err, result) => {
      if (err) {
        return callback(err);
      }

      if (!result) {
        return callback(null, null, { message: "Incorrect email or password" });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      console.log(admin)
      callback(null, token, admin);
    });
  });
};

module.exports = Admin = mongoose.model("Admin", AdminSchema);
