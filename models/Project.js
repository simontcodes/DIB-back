const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  company: {
    type: String,
    required: [true, "Company name is required"],
  },
  contactInfo: {
    type: String,
    required: [true, "Contact information is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  assignedTeam: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
  },
  logo: {
    path: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Completed", "Waiting on team"],
    default: "Pending",
    required: true,
  },
  rolesNeeded: [
    {
      role: String,
      quantity: Number,
    },
  ],
  repos: [String],
  finishedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Project", projectSchema);
