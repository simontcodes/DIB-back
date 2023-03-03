const express = require("express");
const router = express.Router();

const Team = require("../models/Team");

// Get all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find({});
    res.send(teams);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific team
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).send();
    }
    res.send(team);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add member to team
// router.patch("/:id/newmember", async (req, res) => {
//   try {
//     const updateBody = {"teammates":[]}
//     const team = await Team.findById(req.params.id);

//     // team.teammates.forEach((teammate) => {
//     //   console.log(teammate.user)
//     //   updateBody.teammates.push({
//     //     "role": teammate.role,
//     //     "user": teammate.user
//     //   })
//     // })
//     // updateBody.teammates.push(req.body.teammates[0])
//     // const teammates = await Team.findByIdAndUpdate(req.params.id, updateBody, {
//     //   new: true,
//     // });

//     team.teammates.push(req.body.teammates[0])
//     console.log(team)
//     await team.save()

//     if (!team) {
//       return res.status(404).send();
//     }
//     res.send({
//       message: `Applied to ${req.body.teammates[0].role} role`,
//       teammates: teammates.teammates
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Add a member from team
router.patch("/:teamId/teammates/", async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    await team.addTeammate(req.body);
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a member from team
router.delete("/:teamId/teammates/:teammateId", async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    const deletedTeammate = await team.deleteTeammate(req.params.teammateId);
    if (deletedTeammate) {
      return res.status(404).json(deletedTeammate);
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;