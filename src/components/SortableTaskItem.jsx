import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskItem } from './TaskItem'

export function SortableTaskItem({ task, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TaskItem
      task={task}
      dragHandleProps={{ attributes, listeners }}
      setSortableRef={setNodeRef}
      sortableStyle={style}
      isDragging={isDragging}
      {...props}
    />
  )
}
