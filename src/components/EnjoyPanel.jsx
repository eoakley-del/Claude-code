import { useState } from 'react'
import { todayISO } from '../utils/date'

export function EnjoyPanel({ items, suggestion, onAdd, onDelete, onShuffle, onToggleToday }) {
  const [draft, setDraft] = useState('')
  const todayPicks = items.filter((item) => item.todayDate === todayISO())

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

      {todayPicks.length > 0 && (
        <div className="today-picks">
          <span className="today-picks-label">Picked for today</span>
          <ul className="today-picks-list">
            {todayPicks.map((item) => (
              <li key={item.id} className="today-pick-item">
                <span>{item.text}</span>
                <button
                  type="button"
                  className="star-btn active"
                  aria-label="Remove from today"
                  onClick={() => onToggleToday(item.id)}
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          {items.map((item) => {
            const isToday = item.todayDate === todayISO()
            return (
              <li key={item.id} className="enjoy-item">
                <span>{item.text}</span>
                <div className="enjoy-item-actions">
                  <button
                    type="button"
                    className={`star-btn${isToday ? ' active' : ''}`}
                    aria-label={isToday ? 'Remove from today' : 'Pick for today'}
                    onClick={() => onToggleToday(item.id)}
                  >
                    {isToday ? '★' : '☆'}
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove"
                    onClick={() => onDelete(item.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
