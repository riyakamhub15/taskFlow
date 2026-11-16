
const Task = require("../models/Task");
const Project = require("../models/Project");

// 1. CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      status,
      priority,
      deadline,
    } = req.body;

    // Validate required fields
    if (!title || !title.trim() || !projectId) {
      return res.status(400).json({
        message: "Task title and project ID are required",
      });
    }

    // Check whether project belongs to logged-in user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Validate status and priority
    const allowedStatuses = [
      "Todo",
      "In Progress",
      "Completed",
    ];

    const allowedPriorities = ["Low", "Medium", "High"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    // Create task
    const task = await Task.create({
      title: title.trim(),
      description,
      projectId,
      userId: req.userId,
      status,
      priority,
      deadline: deadline || null,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("Create Task Error:", error.message);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

// 2. GET ALL TASKS OF A PROJECT

const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, search } = req.query;

    // Base filter: only logged-in user's tasks
    const filter = {
      userId: req.userId,
    };

    // Filter by project
    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.userId,
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      filter.projectId = projectId;
    }

    // Filter by status
    if (status) {
      const allowedStatuses = [
        "Todo",
        "In Progress",
        "Completed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status filter",
        });
      }

      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      const allowedPriorities = ["Low", "Medium", "High"];

      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority filter",
        });
      }

      filter.priority = priority;
    }

    // Search by task title
    if (search && search.trim()) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const tasks = await Task.find(filter)
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.error("Get Tasks Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};


// 3. GET SINGLE TASK
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate("projectId", "title");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({ task });

  } catch (error) {
    console.error("Get Task Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch task",
    });
  }
};

// 4. UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      deadline,
    } = req.body;

    const allowedStatuses = [
      "Todo",
      "In Progress",
      "Completed",
    ];

    const allowedPriorities = ["Low", "Medium", "High"];

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "Task title cannot be empty",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (deadline !== undefined) updates.deadline = deadline || null;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error("Update Task Error:", error.message);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// 5. DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("Delete Task Error:", error.message);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};


// 6. GET TASK STATISTICS
const getTaskStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
    ] = await Promise.all([
      Task.countDocuments({ userId }),

      Task.countDocuments({
        userId,
        status: "Todo",
      }),

      Task.countDocuments({
        userId,
        status: "In Progress",
      }),

      Task.countDocuments({
        userId,
        status: "Completed",
      }),

      Task.countDocuments({
        userId,
        priority: "Low",
      }),

      Task.countDocuments({
        userId,
        priority: "Medium",
      }),

      Task.countDocuments({
        userId,
        priority: "High",
      }),
    ]);

    res.status(200).json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      pendingTasks: todoTasks + inProgressTasks,
      priority: {
        low: lowPriorityTasks,
        medium: mediumPriorityTasks,
        high: highPriorityTasks,
      },
    });

  } catch (error) {
    console.error("Task Statistics Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch task statistics",
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};
