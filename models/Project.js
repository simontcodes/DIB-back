const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  company: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assignedTeam: {
    type: String,
    required: true,
  },
  dateAssignedTeam: {
    type: Date,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  rolesNeeded: [String],
  repos: [String],
  finishedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Project", projectSchema);
