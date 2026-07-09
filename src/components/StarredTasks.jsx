import { TaskItem } from './TaskItem'

export function StarredTasks({
  tasks,
  categoryOptions,
  showInfo,
  onToggleShowInfo,
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
      <div className="today-picks-header">
        <span className="today-picks-label">Starred for today</span>
        <button type="button" className="panel-toggle" onClick={onToggleShowInfo}>
          {showInfo ? 'Hide categories & dates' : 'Show categories & dates'}
        </button>
      </div>
      <ul className="task-list starred-task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            categoryOptions={categoryOptions}
            showInfo={showInfo}
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
