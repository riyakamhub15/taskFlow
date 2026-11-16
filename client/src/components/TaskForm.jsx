
import React, { useEffect, useState } from "react";

const TaskForm = ({
  onSubmit,
  editingTask,
  projectId,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setStatus(editingTask.status || "Todo");
      setPriority(editingTask.priority || "Medium");

      setDeadline(
        editingTask.deadline
          ? new Date(editingTask.deadline)
              .toISOString()
              .slice(0, 10)
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("Todo");
      setPriority("Medium");
      setDeadline("");
    }

    setError("");
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Task title must have at least 3 characters.");
      return;
    }

    if (title.trim().length > 100) {
      setError("Task title cannot exceed 100 characters.");
      return;
    }

    if (!projectId) {
      setError("Please select a project first.");
      return;
    }

    if (
      deadline &&
      new Date(deadline + "T23:59:59") < new Date()
    ) {
      setError("Deadline cannot be in the past.");
      return;
    }

    setError("");

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      deadline: deadline || null,
      projectId,
    });

    if (!editingTask) {
      setTitle("");
      setDescription("");
      setStatus("Todo");
      setPriority("Medium");
      setDeadline("");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>
        {editingTask ? "Edit Task" : "Create New Task"}
      </h3>

      {error && (
        <p className="form-error">{error}</p>
      )}

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label>Deadline</label>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button type="submit">
        {editingTask ? "Update Task" : "Create Task"}
      </button>

      {editingTask && (
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;
