import { TaskItem } from './TaskItem'

export function TaskList({
  tasks,
  categoryOptions,
  emptyMessage,
  showCompleted,
  onToggleShowCompleted,
  onToggle,
  onDelete,
  onUpdate,
  onToggleToday,
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
  const visible = showCompleted ? [...open, ...done] : open

  return (
    <>
      {visible.length === 0 ? (
        <p className="empty-state">
          All done — {done.length} completed task{done.length === 1 ? '' : 's'} hidden.
        </p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              categoryOptions={categoryOptions}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
              onUpdate={(updates) => onUpdate(task.id, updates)}
              onToggleToday={() => onToggleToday(task.id)}
              onAddSubtask={(text) => onAddSubtask(task.id, text)}
              onToggleSubtask={(subId) => onToggleSubtask(task.id, subId)}
              onUpdateSubtask={(subId, text) => onUpdateSubtask(task.id, subId, text)}
              onDeleteSubtask={(subId) => onDeleteSubtask(task.id, subId)}
            />
          ))}
        </ul>
      )}
      {done.length > 0 && (
        <button type="button" className="show-completed-toggle" onClick={onToggleShowCompleted}>
          {showCompleted ? 'Hide completed tasks' : `Show completed tasks (${done.length})`}
        </button>
      )}
    </>
  )
}
