
function ProjectCard({ project, onEdit, onDelete, onViewTasks }) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>

      <p>
        {project.description || "No description provided."}
      </p>

      <small>
        Created:{" "}
        {new Date(project.createdAt).toLocaleDateString()}
      </small>

      <div className="project-actions">
        <button onClick={() => onViewTasks(project)}>
          View Tasks
        </button>

        <button onClick={() => onEdit(project)}>
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(project._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
