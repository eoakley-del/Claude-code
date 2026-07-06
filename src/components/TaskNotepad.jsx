import { useState } from 'react'

export function TaskNotepad({ onAddTasks }) {
  const [draft, setDraft] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const lines = draft
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length === 0) return

    onAddTasks(lines)
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  return (
    <form className="notepad" onSubmit={handleSubmit}>
      <textarea
        className="notepad-input"
        placeholder={
          'Jot down tasks, one per line…\n\nCall the dentist\nPay rent\nFinish the report'
        }
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={5}
      />
      <div className="notepad-actions">
        <span className="notepad-hint">Each line becomes its own task</span>
        <button type="submit" className="btn btn-primary">
          Add to list
        </button>
      </div>
    </form>
  )
}
