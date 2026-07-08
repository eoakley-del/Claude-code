import { TaskItem } from './TaskItem'

export function StarredTasks({
  tasks,
  categoryOptions,
  onToggle,
  onDelete,
  onUpdate,
  onToggleToday,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}) {
  if (tasks.length === 0) return null

  return (
    <div className="today-picks">
      <span className="today-picks-label">Starred for today</span>
      <ul className="task-list starred-task-list">
        {tasks.map((task) => (
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
    </div>
  )
}
