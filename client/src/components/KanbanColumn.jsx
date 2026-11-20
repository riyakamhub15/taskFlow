
import { useDroppable } from "@dnd-kit/core";

function KanbanColumn({ status, tasks, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "kanban-column-over" : ""}`}
    >
      <div className="kanban-column-header">
        <h3>{status}</h3>
        <span>{tasks.length}</span>
      </div>

      <div className="kanban-tasks">
        {children}
      </div>
    </div>
  );
}

export default KanbanColumn;
