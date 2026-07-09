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

export function StarredTasks({
  tasks,
  categoryOptions,
  showInfo,
  onToggleShowInfo,
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

  if (tasks.length === 0) return null

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
    <div className="today-picks">
      <div className="today-picks-header">
        <span className="today-picks-label">Starred for today</span>
        <button type="button" className="panel-toggle" onClick={onToggleShowInfo}>
          {showInfo ? 'Hide categories & dates' : 'Show categories & dates'}
        </button>
      </div>
      <ul className="task-list starred-task-list">
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
    </div>
  )
}
