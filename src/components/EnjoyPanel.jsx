import { useState } from 'react'

export function EnjoyPanel({ items, suggestion, onAdd, onDelete, onShuffle }) {
  const [draft, setDraft] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onAdd(text)
    setDraft('')
  }

  return (
    <div className="enjoy-panel">
      <p className="enjoy-intro">
        Not tasks — just things worth remembering to enjoy.
      </p>

      {suggestion && (
        <div className="suggestion-card">
          <span className="suggestion-label">Maybe today…</span>
          <p className="suggestion-text">{suggestion.text}</p>
          <button type="button" className="btn btn-ghost" onClick={onShuffle}>
            Suggest something else
          </button>
        </div>
      )}

      <form className="enjoy-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="enjoy-input"
          placeholder="Something you enjoy, e.g. read a chapter, go for a walk…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          Add
        </button>
      </form>

      {items.length > 0 && (
        <ul className="enjoy-list">
          {items.map((item) => (
            <li key={item.id} className="enjoy-item">
              <span>{item.text}</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Remove"
                onClick={() => onDelete(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
