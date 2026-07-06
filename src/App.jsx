import { useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useCloudDoc } from './hooks/useCloudDoc'
import { TaskNotepad } from './components/TaskNotepad'
import { TaskList } from './components/TaskList'
import { EnjoyPanel } from './components/EnjoyPanel'
import './App.css'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const EMPTY_DOC = { tasks: [], delights: [] }

function App({ uid }) {
  const { data, update, ready } = useCloudDoc(uid, EMPTY_DOC)
  const { tasks, delights } = data
  const [suggestionId, setSuggestionId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')

  function setTasks(updater) {
    update((prev) => ({
      ...prev,
      tasks: typeof updater === 'function' ? updater(prev.tasks) : updater,
    }))
  }

  function setDelights(updater) {
    update((prev) => ({
      ...prev,
      delights: typeof updater === 'function' ? updater(prev.delights) : updater,
    }))
  }

  const categoryOptions = useMemo(() => {
    const names = tasks.map((t) => t.category).filter(Boolean)
    return [...new Set(names)].sort()
  }, [tasks])

  const visibleTasks = categoryFilter
    ? tasks.filter((t) => t.category === categoryFilter)
    : tasks

  function addTasks(lines) {
    const newTasks = lines.map((text) => ({
      id: makeId(),
      text,
      done: false,
      category: '',
      dueDate: '',
      workOnDate: '',
      subtasks: [],
    }))
    setTasks((prev) => [...prev, ...newTasks])
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function updateTask(id, updates) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  function addSubtask(taskId, text) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: [...(t.subtasks || []), { id: makeId(), text, done: false }] }
          : t,
      ),
    )
  }

  function toggleSubtask(taskId, subId) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: (t.subtasks || []).map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s,
              ),
            }
          : t,
      ),
    )
  }

  function updateSubtask(taskId, subId, text) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: (t.subtasks || []).map((s) =>
                s.id === subId ? { ...s, text } : s,
              ),
            }
          : t,
      ),
    )
  }

  function deleteSubtask(taskId, subId) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subId) }
          : t,
      ),
    )
  }

  function addDelight(text) {
    setDelights((prev) => [...prev, { id: makeId(), text }])
  }

  function deleteDelight(id) {
    setDelights((prev) => prev.filter((d) => d.id !== id))
    setSuggestionId((current) => (current === id ? null : current))
  }

  function shuffleSuggestion() {
    if (delights.length === 0) {
      setSuggestionId(null)
      return
    }
    const candidates = delights.filter((d) => d.id !== suggestionId)
    const pool = candidates.length > 0 ? candidates : delights
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setSuggestionId(pick.id)
  }

  const suggestion = delights.find((d) => d.id === suggestionId) || delights[0] || null

  if (!ready) {
    return (
      <div className="page">
        <p className="loading-state">Loading your tasks…</p>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <button type="button" className="sign-out" onClick={() => signOut(auth)}>
          Lock
        </button>
        <h1>Task Manager</h1>
        <p>Get things done, and don't forget to enjoy yourself too.</p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Tasks</h2>
          <TaskNotepad onAddTasks={addTasks} />
          {categoryOptions.length > 0 && (
            <div className="category-filter">
              <label>
                <span>Filter</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categoryOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <TaskList
            tasks={visibleTasks}
            categoryOptions={categoryOptions}
            emptyMessage={
              tasks.length === 0
                ? 'No tasks yet — jot some down above.'
                : 'No tasks in this category.'
            }
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onUpdateSubtask={updateSubtask}
            onDeleteSubtask={deleteSubtask}
          />
        </section>

        <section className="panel">
          <h2>Things to enjoy</h2>
          <EnjoyPanel
            items={delights}
            suggestion={suggestion}
            onAdd={addDelight}
            onDelete={deleteDelight}
            onShuffle={shuffleSuggestion}
          />
        </section>
      </main>
    </div>
  )
}

export default App
