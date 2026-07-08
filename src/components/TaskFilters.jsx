import { categoryColor } from '../utils/categoryColor'
import { UNCATEGORIZED } from '../utils/constants'

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

export function TaskFilters({
  filters,
  categoryOptions,
  onChange,
  groupByCategory,
  onToggleGroupByCategory,
  showTaskInfo,
  onToggleShowTaskInfo,
}) {
  function patch(updates) {
    onChange({ ...filters, ...updates })
  }

  function toggleCategory(value) {
    const selected = filters.categories.includes(value)
      ? filters.categories.filter((c) => c !== value)
      : [...filters.categories, value]
    patch({ categories: selected })
  }

  return (
    <div className="task-filters">
      <div className="filter-group category-filter-group">
        <span>Category</span>
        <div className="filter-chip-row">
          <button
            type="button"
            className={`filter-chip${filters.categories.length === 0 ? ' active' : ''}`}
            onClick={() => patch({ categories: [] })}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-chip${filters.categories.includes(UNCATEGORIZED) ? ' active' : ''}`}
            onClick={() => toggleCategory(UNCATEGORIZED)}
          >
            Uncategorized
          </button>
          {categoryOptions.map((name) => {
            const active = filters.categories.includes(name)
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
      </div>

      <DateFilterGroup
        label="Due date"
        mode={filters.dueMode}
        date={filters.dueDate}
        onModeChange={(dueMode) => patch({ dueMode })}
        onDateChange={(dueDate) => patch({ dueDate })}
      />

      <DateFilterGroup
        label="Work on on:"
        mode={filters.workMode}
        date={filters.workDate}
        onModeChange={(workMode) => patch({ workMode })}
        onDateChange={(workDate) => patch({ workDate })}
      />

      <label className="filter-group group-by-toggle">
        <input
          type="checkbox"
          checked={groupByCategory}
          onChange={onToggleGroupByCategory}
        />
        <span>Group by category</span>
      </label>

      <label className="filter-group group-by-toggle">
        <input
          type="checkbox"
          checked={showTaskInfo}
          onChange={onToggleShowTaskInfo}
        />
        <span>Show categories &amp; dates</span>
      </label>
    </div>
  )
}
