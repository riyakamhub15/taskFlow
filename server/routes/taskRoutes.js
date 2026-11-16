
const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

// All task routes require authentication

// Create task
router.post("/", protect, createTask);

// Get all tasks or filter by projectId
router.get("/", protect, getTasks);

// Get task statistics
router.get("/stats", protect, getTaskStats);

// Get single task
router.get("/:id", protect, getTaskById);

// Update task
router.put("/:id", protect, updateTask);

// Delete task
router.delete("/:id", protect, deleteTask);

module.exports = router;
