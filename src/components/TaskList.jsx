import { TaskItem } from './TaskItem'

export function TaskList({
  tasks,
  categoryOptions,
  emptyMessage,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}) {
  if (tasks.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  const open = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  return (
    <>
      <datalist id="category-options">
        {categoryOptions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <ul className="task-list">
        {[...open, ...done].map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
            onUpdate={(updates) => onUpdate(task.id, updates)}
            onAddSubtask={(text) => onAddSubtask(task.id, text)}
            onToggleSubtask={(subId) => onToggleSubtask(task.id, subId)}
            onUpdateSubtask={(subId, text) => onUpdateSubtask(task.id, subId, text)}
            onDeleteSubtask={(subId) => onDeleteSubtask(task.id, subId)}
          />
        ))}
      </ul>
    </>
  )
}
