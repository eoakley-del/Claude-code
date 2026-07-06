export function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet — jot some down above.</p>
  }

  const open = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  return (
    <ul className="task-list">
      {[...open, ...done].map((task) => (
        <li key={task.id} className={`task-item${task.done ? ' done' : ''}`}>
          <label className="task-label">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
            />
            <span>{task.text}</span>
          </label>
          <button
            type="button"
            className="icon-btn"
            aria-label="Delete task"
            onClick={() => onDelete(task.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
