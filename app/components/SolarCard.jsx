// Presentation Component: Renders an astronomical sun timing card with localized title and theme accent.
export function SolarCard({ label, value, description, accentVar }) {
  return (
    <article
      className="sun-card interactive-card"
      style={{
        borderTop: `3px solid ${accentVar}`,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--text-xs)',
          color: accentVar,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'block',
          marginBottom: 'var(--space-2)',
        }}
      >
        {label}
      </span>
      <div className="sun-value">{value}</div>
      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-xs)',
          color: 'var(--ink-soft)',
        }}
      >
        {description}
      </p>
    </article>
  );
}

