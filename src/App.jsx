import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { TaskNotepad } from './components/TaskNotepad'
import { TaskList } from './components/TaskList'
import { EnjoyPanel } from './components/EnjoyPanel'
import './App.css'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function App() {
  const [tasks, setTasks] = useLocalStorage('taskmanager.tasks', [])
  const [delights, setDelights] = useLocalStorage('taskmanager.delights', [])
  const [suggestionId, setSuggestionId] = useState(null)

  function addTasks(lines) {
    const newTasks = lines.map((text) => ({
      id: makeId(),
      text,
      done: false,
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

  return (
    <div className="page">
      <header className="page-header">
        <h1>Task Manager</h1>
        <p>Get things done, and don't forget to enjoy yourself too.</p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Tasks</h2>
          <TaskNotepad onAddTasks={addTasks} />
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
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
