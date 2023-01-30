const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DibsSchema = new Schema({
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
    enum: [
      "Fullstack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Project Manager",
      "QA Tester",
      "UX/UI",
      "DevOps",
    ],
    default: "Fullstack Developer",
  },
});

module.exports = Dibs = mongoose.model("dibs", DibsSchema);
