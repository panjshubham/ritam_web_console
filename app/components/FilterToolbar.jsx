// Presentation Component: Renders accessible filtering and sorting toolbar with synchronized query controls.
export function FilterToolbar({
  selectedLanguage,
  onLanguageChange,
  availableLanguages,
  selectedSpecialism,
  onSpecialismChange,
  availableSpecialisms,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
  onResetFilters,
}) {
  const isFilterActive = Boolean(selectedLanguage || selectedSpecialism || sortBy);

  return (
    <section
      aria-label="Filter practitioners"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Filter controls — responsive stacking */}
      <div className="filter-toolbar">
        {/* Language filter */}
        <div className="filter-group">
          <label
            htmlFor="filter-language"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink)' }}
          >
            Language:
          </label>
          <select
            id="filter-language"
            value={selectedLanguage}
            onChange={onLanguageChange}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
              fontFamily: 'var(--body)',
            }}
          >
            <option value="">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Specialism filter */}
        <div className="filter-group">
          <label
            htmlFor="filter-specialism"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink)' }}
          >
            Specialism:
          </label>
          <select
            id="filter-specialism"
            value={selectedSpecialism}
            onChange={onSpecialismChange}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
              fontFamily: 'var(--body)',
            }}
          >
            <option value="">All Specialisms</option>
            {availableSpecialisms.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Sort order control */}
        <div className="filter-group">
          <label
            htmlFor="filter-sort"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink)' }}
          >
            Sort:
          </label>
          <select
            id="filter-sort"
            value={sortBy}
            onChange={onSortChange}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
              fontFamily: 'var(--body)',
            }}
          >
            <option value="">Default Order</option>
            <option value="experience-desc">Experience (High → Low)</option>
            <option value="experience-asc">Experience (Low → High)</option>
            <option value="name-asc">Name (A → Z)</option>
          </select>
        </div>
      </div>

      {/* Result count + Clear Filters */}
      <div className="filter-toolbar-meta">
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-soft)',
          }}
        >
          Showing {filteredCount} of {totalCount} practitioners
        </div>

        {isFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--ink-soft)',
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--text-sm)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>
    </section>
  );
}

