
import { useDraggable } from "@dnd-kit/core";

function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
    data: { task },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
    >
      <div
        className="task-card-header"
        {...listeners}
        {...attributes}
      >
        <h3>{task.title}</h3>

        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      <p>{task.description || "No description provided."}</p>

      <div className="task-details">
        <span>Status: {task.status}</span>

        <span>
          Deadline:{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "Not set"}
        </span>
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
