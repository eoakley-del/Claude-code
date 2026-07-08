import { useState } from 'react'
import { categoryColor } from '../utils/categoryColor'
import { todayISO, formatDate } from '../utils/date'
import { getTaskCategories } from '../utils/task'
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
  const [expanded, setExpanded] = useState(false)
  const [subtaskDraft, setSubtaskDraft] = useState('')
  const [categoryDraft, setCategoryDraft] = useState('')

  const subtasks = task.subtasks || []
  const doneCount = subtasks.filter((s) => s.done).length
  const overdue = Boolean(task.dueDate) && !task.done && task.dueDate < todayISO()
  const categories = getTaskCategories(task)
  const isToday = task.todayDate === todayISO()
  const textareaRef = useAutoResizeTextarea(task.text)

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

      {(categories.length > 0 || task.dueDate || task.workOnDate || subtasks.length > 0) && (
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
          {subtasks.length > 0 && (
            <span className="chip chip-subtasks">
              {doneCount}/{subtasks.length}
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div className="task-details">
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
