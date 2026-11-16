
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";

import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import TaskStats from "../components/TaskStats";

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

  // Create or update project
  const handleProjectSubmit = async (projectData) => {
    try {
      if (editingProject) {
        await API.put(
          `/projects/${editingProject._id}`,
          projectData
        );

        setEditingProject(null);
      } else {
        await API.post("/projects", projectData);
      }

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to save project"
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
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete project"
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
      } else {
        await API.post("/tasks", {
          ...taskData,
          projectId: selectedProject._id,
        });
      }

      await fetchTasks(selectedProject._id, {
        search,
        status: statusFilter,
        priority: priorityFilter,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to save task"
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
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete task"
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

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Task Statistics */}
      <section className="dashboard-stats">
        <h2>Task Overview</h2>
        <TaskStats />
      </section>

      {/* Project Section */}
      <section className="projects-section">
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

      {/* Task Section */}
      {selectedProject && (
        <section className="tasks-section">

          <h2>
            Tasks: {selectedProject.title}
          </h2>

          <button
            onClick={() => {
              setSelectedProject(null);
              setTasks([]);
              setEditingTask(null);
            }}
          >
            Back to Projects
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
          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found for this project.</p>
          ) : (
            <div className="tasks-container">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}

        </section>
      )}

    </div>
  );
};

export default Dashboard;
