import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { categoryColor } from '../utils/categoryColor'
import { todayISO, formatDate } from '../utils/date'
import { getTaskCategories } from '../utils/task'
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea'

function DragHandle({ attributes, listeners }) {
  return (
    <button
      type="button"
      className="drag-handle"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      ⠿
    </button>
  )
}

function SubtaskRow({ sub, onToggle, onUpdate, onDelete }) {
  const textareaRef = useAutoResizeTextarea(sub.text)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sub.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li className="subtask-item" ref={setNodeRef} style={style}>
      <DragHandle attributes={attributes} listeners={listeners} />
      <input
        type="checkbox"
        checked={sub.done}
        onChange={onToggle}
        aria-label="Mark subtask done"
      />
      <textarea
        ref={textareaRef}
        rows={1}
        className={`subtask-text-input${sub.done ? ' done' : ''}`}
        value={sub.text}
        onChange={(e) => onUpdate(e.target.value)}
      />
      <button
        type="button"
        className="icon-btn"
        aria-label="Delete subtask"
        onClick={onDelete}
      >
        ×
      </button>
    </li>
  )
}

export function TaskItem({
  task,
  categoryOptions,
  showInfo,
  dragHandleProps,
  setSortableRef,
  sortableStyle,
  isDragging,
  onToggle,
  onDelete,
  onUpdate,
  onToggleToday,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onReorderSubtasks,
}) {
  const [expanded, setExpanded] = useState(false)
  const [detailsInfoCollapsed, setDetailsInfoCollapsed] = useState(false)
  const [subtaskDraft, setSubtaskDraft] = useState('')
  const [categoryDraft, setCategoryDraft] = useState('')
  const subtaskSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  )

  const subtasks = task.subtasks || []
  const doneCount = subtasks.filter((s) => s.done).length
  const overdue = Boolean(task.dueDate) && !task.done && task.dueDate < todayISO()
  const categories = getTaskCategories(task)
  const isToday = task.todayDate === todayISO()
  const textareaRef = useAutoResizeTextarea(task.text)
  const notesRef = useAutoResizeTextarea(task.notes || '')

  function handleAddSubtask(e) {
    e.preventDefault()
    const text = subtaskDraft.trim()
    if (!text) return
    onAddSubtask(text)
    setSubtaskDraft('')
  }

  function toggleCategory(name) {
    const next = categories.includes(name)
      ? categories.filter((c) => c !== name)
      : [...categories, name]
    onUpdate({ categories: next })
  }

  function handleAddCategory(e) {
    e.preventDefault()
    const name = categoryDraft.trim()
    if (!name || categories.includes(name)) {
      setCategoryDraft('')
      return
    }
    onUpdate({ categories: [...categories, name] })
    setCategoryDraft('')
  }

  function handleSubtaskDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = subtasks.findIndex((s) => s.id === active.id)
    const newIndex = subtasks.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorderSubtasks(arrayMove(subtasks, oldIndex, newIndex))
  }

  return (
    <li
      className={`task-item${task.done ? ' done' : ''}${isDragging ? ' dragging' : ''}`}
      ref={setSortableRef}
      style={sortableStyle}
    >
      <div className="task-row">
        {dragHandleProps && <DragHandle {...dragHandleProps} />}
        <input
          type="checkbox"
          checked={task.done}
          onChange={onToggle}
          aria-label="Mark task done"
        />
        <textarea
          ref={textareaRef}
          rows={1}
          className="task-text-input"
          value={task.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />
        {subtasks.length > 0 && (
          <span className="chip chip-subtasks">
            {doneCount}/{subtasks.length}
          </span>
        )}
        <button
          type="button"
          className={`star-btn${isToday ? ' active' : ''}`}
          aria-label={isToday ? 'Remove from today' : 'Star for today'}
          onClick={onToggleToday}
        >
          {isToday ? '★' : '☆'}
        </button>
        <button
          type="button"
          className="icon-btn caret"
          aria-label={expanded ? 'Collapse details' : 'Edit details'}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? '▾' : '▸'}
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Delete task"
          onClick={onDelete}
        >
          ×
        </button>
      </div>

      {showInfo && (categories.length > 0 || task.dueDate || task.workOnDate) && (
        <div className="task-chips">
          {categories.map((name) => {
            const color = categoryColor(name)
            return (
              <span
                key={name}
                className="chip"
                style={{ background: color.bg, borderLeftColor: color.border }}
              >
                {name}
              </span>
            )
          })}
          {task.dueDate && (
            <span className={`chip chip-due${overdue ? ' overdue' : ''}`}>
              Due {formatDate(task.dueDate)}
            </span>
          )}
          {task.workOnDate && (
            <span className="chip chip-workon">
              Work on on: {formatDate(task.workOnDate)}
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div className="task-details">
          <div className="details-info-toggle-row">
            <button
              type="button"
              className="panel-toggle"
              onClick={() => setDetailsInfoCollapsed((c) => !c)}
            >
              {detailsInfoCollapsed ? 'Show categories & dates' : 'Hide categories & dates'}
            </button>
          </div>

          {!detailsInfoCollapsed && (
            <>
              <div className="field field-categories">
                <span>Categories</span>
                {categoryOptions.length > 0 && (
                  <div className="filter-chip-row">
                    {categoryOptions.map((name) => {
                      const active = categories.includes(name)
                      const color = categoryColor(name)
                      return (
                        <button
                          type="button"
                          key={name}
                          className={`filter-chip${active ? ' active' : ''}`}
                          style={active ? { background: color.bg, borderColor: color.border } : undefined}
                          onClick={() => toggleCategory(name)}
                        >
                          {name}
                        </button>
                      )
                    })}
                  </div>
                )}
                <form className="add-category-form" onSubmit={handleAddCategory}>
                  <input
                    type="text"
                    placeholder="New category…"
                    value={categoryDraft}
                    onChange={(e) => setCategoryDraft(e.target.value)}
                  />
                  <button type="submit" className="btn btn-ghost">
                    Add
                  </button>
                </form>
              </div>

              <div className="task-detail-fields">
                <label className="field">
                  <span>Due date</span>
                  <div className="date-input-row">
                    <input
                      type="date"
                      value={task.dueDate || ''}
                      onChange={(e) => onUpdate({ dueDate: e.target.value })}
                    />
                    {task.dueDate && (
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Clear due date"
                        onClick={() => onUpdate({ dueDate: '' })}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </label>
                <label className="field">
                  <span>Work on on:</span>
                  <div className="date-input-row">
                    <input
                      type="date"
                      value={task.workOnDate || ''}
                      onChange={(e) => onUpdate({ workOnDate: e.target.value })}
                    />
                    {task.workOnDate && (
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Clear work-on date"
                        onClick={() => onUpdate({ workOnDate: '' })}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </label>
              </div>
            </>
          )}

          <div className="field field-notes">
            <span>Notes</span>
            <textarea
              ref={notesRef}
              rows={1}
              className="notes-input"
              placeholder="Add any additional details…"
              value={task.notes || ''}
              onChange={(e) => onUpdate({ notes: e.target.value })}
            />
          </div>

          <div className="subtasks">
            <span className="subtasks-label">Subtasks</span>
            {subtasks.length > 0 && (
              <DndContext
                sensors={subtaskSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSubtaskDragEnd}
              >
                <SortableContext
                  items={subtasks.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="subtask-list">
                    {subtasks.map((sub) => (
                      <SubtaskRow
                        key={sub.id}
                        sub={sub}
                        onToggle={() => onToggleSubtask(sub.id)}
                        onUpdate={(text) => onUpdateSubtask(sub.id, text)}
                        onDelete={() => onDeleteSubtask(sub.id)}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
            <form className="subtask-form" onSubmit={handleAddSubtask}>
              <input
                type="text"
                placeholder="Add a subtask…"
                value={subtaskDraft}
                onChange={(e) => setSubtaskDraft(e.target.value)}
              />
              <button type="submit" className="btn btn-ghost">
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </li>
  )
}
