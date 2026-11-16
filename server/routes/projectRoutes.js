
const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

// All project routes require authentication

// Create a project
router.post("/", protect, createProject);

// Get all logged-in user's projects
router.get("/", protect, getProjects);

// Get a single project
router.get("/:id", protect, getProjectById);

// Update a project
router.put("/:id", protect, updateProject);

// Delete a project
router.delete("/:id", protect, deleteProject);

module.exports = router;
