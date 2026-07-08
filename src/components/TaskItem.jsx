import { useState } from 'react'
import { categoryColor } from '../utils/categoryColor'
import { todayISO, formatDate } from '../utils/date'
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea'

function SubtaskRow({ sub, onToggle, onUpdate, onDelete }) {
  const textareaRef = useAutoResizeTextarea(sub.text)

  return (
    <li className="subtask-item">
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
  onToggle,
  onDelete,
  onUpdate,
  onToggleToday,
  onAddSubtask,
  onToggleSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}) {
  const [expanded, setExpanded] = useState(false)
  const [subtaskDraft, setSubtaskDraft] = useState('')

  const subtasks = task.subtasks || []
  const doneCount = subtasks.filter((s) => s.done).length
  const overdue = Boolean(task.dueDate) && !task.done && task.dueDate < todayISO()
  const color = categoryColor(task.category)
  const isToday = task.todayDate === todayISO()
  const textareaRef = useAutoResizeTextarea(task.text)

  function handleAddSubtask(e) {
    e.preventDefault()
    const text = subtaskDraft.trim()
    if (!text) return
    onAddSubtask(text)
    setSubtaskDraft('')
  }

  return (
    <li className={`task-item${task.done ? ' done' : ''}`}>
      <div className="task-row">
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

      {(task.category || task.dueDate || task.workOnDate || subtasks.length > 0) && (
        <div className="task-chips">
          {task.category && (
            <span
              className="chip"
              style={{ background: color.bg, borderLeftColor: color.border }}
            >
              {task.category}
            </span>
          )}
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
          {subtasks.length > 0 && (
            <span className="chip chip-subtasks">
              {doneCount}/{subtasks.length}
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div className="task-details">
          <div className="task-detail-fields">
            <label className="field">
              <span>Category</span>
              <input
                type="text"
                list="category-options"
                value={task.category || ''}
                onChange={(e) => onUpdate({ category: e.target.value })}
                placeholder="e.g. Work"
              />
            </label>
            <label className="field">
              <span>Due date</span>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Work on on:</span>
              <input
                type="date"
                value={task.workOnDate || ''}
                onChange={(e) => onUpdate({ workOnDate: e.target.value })}
              />
            </label>
          </div>

          <div className="subtasks">
            <span className="subtasks-label">Subtasks</span>
            {subtasks.length > 0 && (
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
