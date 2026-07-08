import { TaskItem } from './TaskItem'
import { categoryColor } from '../utils/categoryColor'
import { getTaskCategories } from '../utils/task'
import { UNCATEGORIZED } from '../utils/constants'

function TaskItemList({
  tasks,
  categoryOptions,
  showInfo,
  onToggle,
  onDelete,
  onUpdate,
  onToggleToday,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}) {
  return (
    <ul className="task-list">
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
  )
}

export function TaskList({
  tasks,
  categoryOptions,
  emptyMessage,
  showCompleted,
  onToggleShowCompleted,
  groupByCategory,
  ...itemHandlers
}) {
  if (tasks.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  const open = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)
  const visible = showCompleted ? [...open, ...done] : open

  const groups = groupByCategory
    ? [...categoryOptions, UNCATEGORIZED]
        .map((name) => ({
          name,
          tasks: visible.filter((t) => {
            const cats = getTaskCategories(t)
            return name === UNCATEGORIZED ? cats.length === 0 : cats.includes(name)
          }),
        }))
        .filter((group) => group.tasks.length > 0)
    : null

  return (
    <>
      {visible.length === 0 ? (
        <p className="empty-state">
          All done — {done.length} completed task{done.length === 1 ? '' : 's'} hidden.
        </p>
      ) : groups ? (
        groups.map((group) => {
          const isUncategorized = group.name === UNCATEGORIZED
          const color = isUncategorized ? null : categoryColor(group.name)
          return (
            <div className="task-group" key={group.name}>
              <div
                className="task-group-header"
                style={
                  isUncategorized
                    ? undefined
                    : { background: color.bg, borderLeftColor: color.border }
                }
              >
                {isUncategorized ? 'Uncategorized' : group.name}
              </div>
              <TaskItemList tasks={group.tasks} categoryOptions={categoryOptions} {...itemHandlers} />
            </div>
          )
        })
      ) : (
        <TaskItemList tasks={visible} categoryOptions={categoryOptions} {...itemHandlers} />
      )}
      {done.length > 0 && (
        <button type="button" className="show-completed-toggle" onClick={onToggleShowCompleted}>
          {showCompleted ? 'Hide completed tasks' : `Show completed tasks (${done.length})`}
        </button>
      )}
    </>
  )
}
