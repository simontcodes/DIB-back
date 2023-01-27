const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Super Admin", "Regular Admin"],
    default: "Regular Admin",
  },
});

module.exports = Admin = mongoose.model("Admin", AdminSchema);
