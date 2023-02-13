require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

//authentication function
const authenticateJWT = require("./auth");

const app = express();

//Declaring Routes
const ProjectRoutes = require("./routes/ProjectRoutes.js");
const AdminRoutes = require("./routes/AdminRoutes.js");
const UserRoutes = require("./routes/UserRoutes.js");
const LogInRoutes = require("./routes/LogInRoutes.js");

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Routes
app.use("/projects", authenticateJWT, ProjectRoutes);
//Auth for dibs routes is done inside
app.use("/dibs", UserRoutes);
// app.use("/admins", authenticateJWT, AdminRoutes);
app.use("/admins", AdminRoutes);
//Login routes only includes log in routes for admin and dibs
app.use("/login", LogInRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
