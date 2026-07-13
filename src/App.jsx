import { useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useCloudDoc } from './hooks/useCloudDoc'
import { useLocalStorage } from './hooks/useLocalStorage'
import { matchesDateFilter, todayISO } from './utils/date'
import { UNCATEGORIZED } from './utils/constants'
import { getTaskCategories } from './utils/task'
import { reorderSubset } from './utils/reorder'
import { TaskNotepad } from './components/TaskNotepad'
import { TaskFilters } from './components/TaskFilters'
import { TaskList } from './components/TaskList'
import { StarredTasks } from './components/StarredTasks'
import { EnjoyPanel } from './components/EnjoyPanel'
import './App.css'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const EMPTY_DOC = { tasks: [], delights: [] }

const DEFAULT_FILTERS = {
  categories: [],
  dueMode: 'any',
  dueDate: '',
  workMode: 'any',
  workDate: '',
}

function App({ uid }) {
  const { data, update, ready } = useCloudDoc(uid, EMPTY_DOC)
  const { tasks, delights } = data
  const [suggestionId, setSuggestionId] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [enjoyCollapsed, setEnjoyCollapsed] = useLocalStorage(
    'taskmanager.enjoyCollapsed',
    false,
  )
  const [showCompleted, setShowCompleted] = useLocalStorage(
    'taskmanager.showCompleted',
    false,
  )
  const [groupByCategory, setGroupByCategory] = useLocalStorage(
    'taskmanager.groupByCategory',
    false,
  )
  const [showTaskInfo, setShowTaskInfo] = useLocalStorage(
    'taskmanager.showTaskInfo',
    true,
  )
  const [filtersCollapsed, setFiltersCollapsed] = useLocalStorage(
    'taskmanager.filtersCollapsed',
    false,
  )
  const [starredShowInfo, setStarredShowInfo] = useLocalStorage(
    'taskmanager.starredShowInfo',
    true,
  )

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
    const names = tasks.flatMap((t) => getTaskCategories(t))
    return [...new Set(names)].sort()
  }, [tasks])

  const visibleTasks = tasks.filter((t) => {
    if (filters.categories.length > 0) {
      const taskCategories = getTaskCategories(t)
      const matchesCategory =
        taskCategories.length > 0
          ? taskCategories.some((c) => filters.categories.includes(c))
          : filters.categories.includes(UNCATEGORIZED)
      if (!matchesCategory) return false
    }
    if (!matchesDateFilter(t.dueDate, filters.dueMode, filters.dueDate)) return false
    if (!matchesDateFilter(t.workOnDate, filters.workMode, filters.workDate)) return false
    return true
  })

  const starredTasks = tasks.filter((t) => t.todayDate === todayISO())

  function addTasks(lines) {
    const newTasks = lines.map((text) => ({
      id: makeId(),
      text,
      done: false,
      categories: [],
      dueDate: '',
      workOnDate: '',
      todayDate: '',
      subtasks: [],
      notes: '',
    }))
    setTasks((prev) => [...newTasks, ...prev])
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function toggleTaskToday(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, todayDate: t.todayDate === todayISO() ? '' : todayISO() } : t,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function updateTask(id, updates) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  function reorderTasks(oldSubsetOrder, newSubsetOrder) {
    setTasks((prev) => reorderSubset(prev, oldSubsetOrder, newSubsetOrder))
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
    setDelights((prev) => [{ id: makeId(), text, todayDate: '' }, ...prev])
  }

  function toggleTodayPick(id) {
    setDelights((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, todayDate: d.todayDate === todayISO() ? '' : todayISO() } : d,
      ),
    )
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
        <section className="panel panel-tasks">
          <h2>Tasks</h2>
          <StarredTasks
            tasks={starredTasks}
            categoryOptions={categoryOptions}
            showInfo={starredShowInfo}
            onToggleShowInfo={() => setStarredShowInfo((s) => !s)}
            onReorderTasks={reorderTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onToggleToday={toggleTaskToday}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onUpdateSubtask={updateSubtask}
            onDeleteSubtask={deleteSubtask}
          />
          <TaskNotepad onAddTasks={addTasks} />
          <div className="filters-toggle-row">
            <button
              type="button"
              className="panel-toggle"
              onClick={() => setFiltersCollapsed((c) => !c)}
            >
              {filtersCollapsed ? 'Show filters' : 'Hide filters'}
            </button>
          </div>
          {!filtersCollapsed && (
            <TaskFilters
              filters={filters}
              categoryOptions={categoryOptions}
              onChange={setFilters}
              groupByCategory={groupByCategory}
              onToggleGroupByCategory={() => setGroupByCategory((g) => !g)}
              showTaskInfo={showTaskInfo}
              onToggleShowTaskInfo={() => setShowTaskInfo((s) => !s)}
            />
          )}
          <TaskList
            tasks={visibleTasks}
            categoryOptions={categoryOptions}
            emptyMessage={
              tasks.length === 0
                ? 'No tasks yet — jot some down above.'
                : 'No tasks match these filters.'
            }
            showCompleted={showCompleted}
            onToggleShowCompleted={() => setShowCompleted((s) => !s)}
            showInfo={showTaskInfo}
            groupByCategory={groupByCategory}
            onReorderTasks={reorderTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onToggleToday={toggleTaskToday}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onUpdateSubtask={updateSubtask}
            onDeleteSubtask={deleteSubtask}
          />
        </section>

        <section className={`panel panel-enjoy${enjoyCollapsed ? ' panel-collapsed' : ''}`}>
          <div className="panel-header">
            <h2>Things to enjoy</h2>
            <button
              type="button"
              className="panel-toggle"
              onClick={() => setEnjoyCollapsed((c) => !c)}
            >
              {enjoyCollapsed ? 'Show' : 'Hide'}
            </button>
          </div>
          {!enjoyCollapsed && (
            <EnjoyPanel
              items={delights}
              suggestion={suggestion}
              onAdd={addDelight}
              onDelete={deleteDelight}
              onShuffle={shuffleSuggestion}
              onToggleToday={toggleTodayPick}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
