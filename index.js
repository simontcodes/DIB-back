require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

//Declaring Routes
const ProjectRoutes = require("./routes/ProjectRoutes.js");
const AdminRoutes = require("./routes/AdminRoutes.js");
const UserRoutes = require("./routes/UserRoutes.js");

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
app.use("/projects", ProjectRoutes);
app.use("/admins", AdminRoutes);
app.use("/dibs", UserRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
