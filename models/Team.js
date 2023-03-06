const mongoose = require("mongoose");

const User = require("../models/User");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teammates: [
      {
        role: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { _id: false }
);

teamSchema.methods.addTeammate = async function (teammate) {
  this.teammates.push(teammate);
  await this.save();
};

teamSchema.methods.deleteTeammate = async function (teammateId) {
  const teammateIndex = this.teammates.findIndex(
    (teammate) => teammate.user.toString() === teammateId.toString()
  );

  if (teammateIndex !== -1) {
    this.teammates.splice(teammateIndex, 1);
    await this.save();
    //finds user and sets user.team to null
    const user = await User.findById(teammateId);
    if (!user) {
      throw new Error("User not found");
    }
    user.team = null;
    await user.save();
  } else {
    return { message: "Team member not found" };
  }
};

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
