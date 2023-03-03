const express = require("express");
const router = express.Router();
//multer as middleware
const upload = require("../middleware/upload");

//Mongoose Models
const Project = require("../models/Project");
const Team = require("../models/Team");

// Create a project
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const team = new Team({
      name: req.body.teamName,
    });
    await team.save();

    const project = new Project({
      company: req.body.company,
      contactInfo: req.body.contactInfo,
      assignedTeam: team._id,
      rolesNeeded: JSON.parse(req.body.roles),
      logo: req.file.path, // set the image path as a string in the project document
    });
    
    await project.save();
    res.status(201).send({project, team});
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send();
    }
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific project
router.patch("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).send();
    }
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a specific project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).send();
    }
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
