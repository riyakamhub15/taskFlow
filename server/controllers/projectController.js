
const Project = require("../models/Project");

// 1. CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    // Create project
    const project = await Project.create({
      title: title.trim(),
      description,
      userId: req.userId,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    console.error("Create Project Error:", error.message);
    res.status(500).json({
      message: "Failed to create project",
    });
  }
};

// 2. GET ALL USER PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects,
    });

  } catch (error) {
    console.error("Get Projects Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

// 3. GET SINGLE PROJECT
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({ project });

  } catch (error) {
    console.error("Get Project Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch project",
    });
  }
};

// 4. UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "Project title cannot be empty",
      });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });

  } catch (error) {
    console.error("Update Project Error:", error.message);
    res.status(500).json({
      message: "Failed to update project",
    });
  }
};

// 5. DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (error) {
    console.error("Delete Project Error:", error.message);
    res.status(500).json({
      message: "Failed to delete project",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
