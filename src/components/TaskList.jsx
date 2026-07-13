import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskItem } from './TaskItem'
import { SortableTaskItem } from './SortableTaskItem'
import { categoryColor } from '../utils/categoryColor'
import { getTaskCategories } from '../utils/task'
import { UNCATEGORIZED } from '../utils/constants'

function TaskItemList({
  tasks,
  categoryOptions,
  showInfo,
  onReorderTasks,
  onToggle,
  onDelete,
  onUpdate,
  onToggleToday,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  )

  const notDone = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  function itemProps(task) {
    return {
      task,
      categoryOptions,
      showInfo,
      onToggle: () => onToggle(task.id),
      onDelete: () => onDelete(task.id),
      onUpdate: (updates) => onUpdate(task.id, updates),
      onToggleToday: () => onToggleToday(task.id),
      onAddSubtask: (text) => onAddSubtask(task.id, text),
      onToggleSubtask: (subId) => onToggleSubtask(task.id, subId),
      onUpdateSubtask: (subId, text) => onUpdateSubtask(task.id, subId, text),
      onDeleteSubtask: (subId) => onDeleteSubtask(task.id, subId),
      onReorderSubtasks: (newSubtasks) => onUpdate(task.id, { subtasks: newSubtasks }),
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = notDone.findIndex((t) => t.id === active.id)
    const newIndex = notDone.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorderTasks(notDone, arrayMove(notDone, oldIndex, newIndex))
  }

  return (
    <ul className="task-list">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={notDone.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {notDone.map((task) => (
            <SortableTaskItem key={task.id} {...itemProps(task)} />
          ))}
        </SortableContext>
      </DndContext>
      {done.map((task) => (
        <TaskItem key={task.id} {...itemProps(task)} />
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
  const done = [...tasks.filter((t) => t.done)].sort(
    (a, b) => (b.completedAt || 0) - (a.completedAt || 0),
  )

  const groups = groupByCategory
    ? [UNCATEGORIZED, ...categoryOptions]
        .map((name) => ({
          name,
          tasks: open.filter((t) => {
            const cats = getTaskCategories(t)
            return name === UNCATEGORIZED ? cats.length === 0 : cats.includes(name)
          }),
        }))
        .filter((group) => group.tasks.length > 0)
    : null

  return (
    <>
      {open.length === 0 && !showCompleted && (
        <p className="empty-state">
          All done — {done.length} completed task{done.length === 1 ? '' : 's'} hidden.
        </p>
      )}
      {open.length > 0 &&
        (groups ? (
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
          <TaskItemList tasks={open} categoryOptions={categoryOptions} {...itemHandlers} />
        ))}
      {showCompleted && done.length > 0 && (
        <div className="task-group">
          <div className="task-group-header">Completed</div>
          <TaskItemList tasks={done} categoryOptions={categoryOptions} {...itemHandlers} />
        </div>
      )}
      {done.length > 0 && (
        <button type="button" className="show-completed-toggle" onClick={onToggleShowCompleted}>
          {showCompleted ? 'Hide completed tasks' : `Show completed tasks (${done.length})`}
        </button>
      )}
    </>
  )
}
