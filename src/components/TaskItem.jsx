import { useState } from 'react'
import { categoryColor } from '../utils/categoryColor'
import { todayISO, formatDate } from '../utils/date'

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
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
        <input
          type="text"
          className="task-text-input"
          value={task.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />
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
              Work on {formatDate(task.workOnDate)}
            </span>
          )}
          {subtasks.length > 0 && (
            <span className="chip chip-subtasks">
              {doneCount}/{subtasks.length}
            </span>
          )}
        </div>
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
              <span>Work on</span>
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
                  <li key={sub.id} className="subtask-item">
                    <input
                      type="checkbox"
                      checked={sub.done}
                      onChange={() => onToggleSubtask(sub.id)}
                      aria-label="Mark subtask done"
                    />
                    <input
                      type="text"
                      className={`subtask-text-input${sub.done ? ' done' : ''}`}
                      value={sub.text}
                      onChange={(e) => onUpdateSubtask(sub.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label="Delete subtask"
                      onClick={() => onDeleteSubtask(sub.id)}
                    >
                      ×
                    </button>
                  </li>
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
