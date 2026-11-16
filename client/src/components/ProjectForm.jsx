
import React, { useEffect, useState } from "react";

const ProjectForm = ({
  onSubmit,
  editingProject,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title || "");
      setDescription(editingProject.description || "");
    } else {
      setTitle("");
      setDescription("");
    }

    setError("");
  }, [editingProject]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Project title must have at least 3 characters.");
      return;
    }

    if (title.trim().length > 60) {
      setError("Project title cannot exceed 60 characters.");
      return;
    }

    if (description.length > 300) {
      setError("Description cannot exceed 300 characters.");
      return;
    }

    setError("");

    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h3>
        {editingProject ? "Edit Project" : "Create New Project"}
      </h3>

      {error && (
        <p className="form-error">{error}</p>
      )}

      <input
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={60}
      />

      <textarea
        placeholder="Project description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={300}
      />

      <button type="submit">
        {editingProject ? "Update Project" : "Create Project"}
      </button>

      {editingProject && (
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

export default ProjectForm;
