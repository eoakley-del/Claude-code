const DATE_FILTER_MODES = [
  { value: 'any', label: 'Any' },
  { value: 'onOrBeforeToday', label: 'On or before today' },
  { value: 'exact', label: 'On exact date…' },
]

function DateFilterGroup({ label, mode, date, onModeChange, onDateChange }) {
  return (
    <label className="filter-group">
      <span>{label}</span>
      <select value={mode} onChange={(e) => onModeChange(e.target.value)}>
        {DATE_FILTER_MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      {mode === 'exact' && (
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      )}
    </label>
  )
}

export function TaskFilters({ filters, categoryOptions, onChange }) {
  function patch(updates) {
    onChange({ ...filters, ...updates })
  }

  return (
    <div className="task-filters">
      <label className="filter-group">
        <span>Category</span>
        <select
          value={filters.category}
          onChange={(e) => patch({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categoryOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <DateFilterGroup
        label="Due date"
        mode={filters.dueMode}
        date={filters.dueDate}
        onModeChange={(dueMode) => patch({ dueMode })}
        onDateChange={(dueDate) => patch({ dueDate })}
      />

      <DateFilterGroup
        label="Work on"
        mode={filters.workMode}
        date={filters.workDate}
        onModeChange={(workMode) => patch({ workMode })}
        onDateChange={(workDate) => patch({ workDate })}
      />
    </div>
  )
}
