require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
    
      console.log(user)
      callback(null, token, user);
    });
  });
};

//method to recover a password

UserSchema.methods.sendPasswordResetEmail = function () {
  const resetPasswordToken = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const resetPasswordLink = `http://localhost:3000/reset-password/${resetPasswordToken}`;

  const transporter = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
      user: "digitalimpactbuilders@hotmail.com",
      pass: process.env.HOTMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "digitalimpactbuilders@hotmail.com",
    to: this.email,
    subject: "Password Reset",
    html: `<body>
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Recovery</h1>
    <p style="font-size: 16px; margin-bottom: 20px;">Hi there,</p>
    <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset the password for your account. If you did not initiate this request, please disregard this email.</p>
    <p style="font-size: 16px; margin-bottom: 20px;">To reset your password, please click the button below:</p>
    <table style="margin: auto;">
      <tr>
        <td style="background-color: #5c5c5c; padding: 15px 30px; border-radius: 4px;">
          <a href="${resetPasswordLink}" style="color: #ffffff; font-size: 16px; text-decoration: none;">Reset Password</a>
        </td>
      </tr>
    </table>
    <p style="font-size: 16px; margin-top: 20px;">This link will be valid for 1 Hour.</p>
    <p style="font-size: 16px; margin-top: 20px;">If you continue to have trouble, please reach out to us at digitalimpactbuilders@hotmail.com.</p>
    <p style="font-size: 16px; margin-top: 20px;">Best regards,</p>
    <p style="font-size: 16px; margin-top: 20px;">The Team at Digital Impact Builders</p>
  </body>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = User = mongoose.model("users", UserSchema);
