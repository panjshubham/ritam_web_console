// Presentation Component: Renders accessible city selection control and coordinate readout.
export function CityPicker({ cities, selectedCityId, selectedCity, onCityChange }) {
  return (
    <section
      aria-label="Observation node selection"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <div className="city-picker-row">
        <label
          htmlFor="city-select"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
          }}
        >
          Observation Node:
        </label>
        <select
          id="city-select"
          value={selectedCityId}
          onChange={onCityChange}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--ink)',
            fontFamily: 'var(--body)',
          }}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name} ({city.state})
            </option>
          ))}
        </select>

        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-soft)',
          }}
        >
          {selectedCity.lat.toFixed(4)}°N, {selectedCity.lng.toFixed(4)}°E
        </span>
      </div>
    </section>
  );
}

