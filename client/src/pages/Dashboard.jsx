import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {DndContext, pointerWithin} from "@dnd-kit/core";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import KanbanColumn from "../components/KanbanColumn";
import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import TaskStats from "../components/TaskStats";
import NotificationSettings from "../components/NotificationSettings";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Project states
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // Task states
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/projects");
      setProjects(response.data.projects || response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to fetch projects"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks with filters
  const fetchTasks = async (projectId, filters = {}) => {
    if (!projectId) return;

    try {
      setLoadingTasks(true);
      setError("");

      const params = {
        projectId,
        ...filters,
      };

      const response = await API.get("/tasks", { params });

      setTasks(response.data.tasks || response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to fetch tasks"
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  // Initial project loading
  useEffect(() => {
    fetchProjects();
  }, []);

  // Smooth scroll when switching between projects and tasks
useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [selectedProject]);

  // Create or update project
  const handleProjectSubmit = async (projectData) => {
  try {
    if (editingProject) {
      await API.put(
        `/projects/${editingProject._id}`,
        projectData
      );

      setEditingProject(null);
      toast.success("Project updated successfully!");
    } else {
      await API.post("/projects", projectData);
      toast.success("Project created successfully!");
    }

    await fetchProjects();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to save project"
    );
  }
};

  // Edit project
  const handleEditProject = (project) => {
    setEditingProject(project);
  };

  // Delete project
  const handleDeleteProject = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/projects/${id}`);

    if (selectedProject?._id === id) {
      setSelectedProject(null);
      setTasks([]);
    }

    await fetchProjects();
    toast.success("Project deleted successfully!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete project"
    );
  }
};

  // Select project and fetch its tasks
  const handleViewTasks = (project) => {
    setSelectedProject(project);

    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");

    fetchTasks(project._id);
  };

  // Create or update task
  const handleTaskSubmit = async (taskData) => {
  try {
    if (editingTask) {
      await API.put(
        `/tasks/${editingTask._id}`,
        taskData
      );

      setEditingTask(null);
      toast.success("Task updated successfully!");
    } else {
      await API.post("/tasks", {
        ...taskData,
        projectId: selectedProject._id,
      });

      toast.success("Task created successfully!");
    }

    await fetchTasks(selectedProject._id, {
      search,
      status: statusFilter,
      priority: priorityFilter,
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to save task"
    );
  }
};

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  // Delete task
  const handleDeleteTask = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/tasks/${id}`);

    await fetchTasks(selectedProject._id, {
      search,
      status: statusFilter,
      priority: priorityFilter,
    });

    toast.success("Task deleted successfully!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete task"
    );
  }
};


const handleDragEnd = async (event) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  const newStatus = over.id;

  const task = tasks.find((t) => t._id === taskId);

  if (!task || task.status === newStatus) return;

  const previousStatus = task.status;

  // Optimistically update the UI
  setTasks((prevTasks) =>
    prevTasks.map((t) =>
      t._id === taskId
        ? { ...t, status: newStatus }
        : t
    )
  );

  try {
    await API.put(`/tasks/${taskId}`, {
      ...task,
      status: newStatus,
    });

    toast.success(`Task moved to ${newStatus}!`);
  } catch (error) {
    // Restore previous status if API fails
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === taskId
          ? { ...t, status: previousStatus }
          : t
      )
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to update task status"
    );
  }
};

  // Apply search and filters
  const fetchFilteredTasks = () => {
    fetchTasks(selectedProject._id, {
      search: search.trim(),
      status: statusFilter,
      priority: priorityFilter,
    });
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");

    fetchTasks(selectedProject._id);
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div>
          <h1>TaskFlow Dashboard</h1>
          <p>
            Welcome, {user?.name || "User"}!
          </p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

    
      {/* Task Statistics */}
      <section className="dashboard-stats">
        <h2>Task Overview</h2>
        <TaskStats />
      </section>

{/* Notification Settings */}
<section className="notification-section">
  <NotificationSettings />
</section>

      {/* Project Section */}
      {/* Project Section */}
{!selectedProject && (
  <section className="projects-section page-transition">
    <h2>My Projects</h2>

    <ProjectForm
      onSubmit={handleProjectSubmit}
      editingProject={editingProject}
      onCancel={() => setEditingProject(null)}
    />

    {loading ? (
      <p>Loading projects...</p>
    ) : projects.length === 0 ? (
      <p>No projects found. Create your first project!</p>
    ) : (
      <div className="projects-container">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onViewTasks={handleViewTasks}
          />
        ))}
      </div>
    )}
  </section>
)}

      {/* Task Section */}
     {selectedProject && (
  <section className="tasks-section page-transition">

          <h2>
            Tasks: {selectedProject.title}
          </h2>

          <button
  className="back-button"
  onClick={() => {
    setSelectedProject(null);
    setTasks([]);
    setEditingTask(null);
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  }}
>
  ← Back to Projects
</button>

          {/* Search and Filters */}
          <div className="task-filters">

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button onClick={fetchFilteredTasks}>
              Apply Filters
            </button>

            <button onClick={handleClearFilters}>
              Clear Filters
            </button>

          </div>

          {/* Task Form */}
          <TaskForm
            onSubmit={handleTaskSubmit}
            editingTask={editingTask}
            projectId={selectedProject._id}
            onCancel={() => setEditingTask(null)}
          />

          {/* Task List */}
        
{/* Kanban Task Board */}
{loadingTasks ? (
  <p>Loading tasks...</p>
) : (
  <DndContext
  collisionDetection={pointerWithin}
  onDragEnd={handleDragEnd}
>
    <div className="kanban-board">
      {["Todo", "In Progress", "Completed"].map((status) => {
        const filteredTasks = tasks.filter(
          (task) => task.status === status
        );

        return (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks}
          >
            {filteredTasks.length === 0 ? (
              <p className="empty-column">No tasks here</p>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </KanbanColumn>
        );
      })}
    </div>
  </DndContext>
)}


        </section>
      )}

    </div>
  );
};

export default Dashboard;
