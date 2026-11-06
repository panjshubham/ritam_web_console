// Client Component: Next.js route error boundary providing graceful failure capture and reset capabilities.
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <div className="page-container" style={{ paddingTop: 'var(--space-10)' }}>
      <div
        role="alert"
        className="alert-card"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h2 className="alert-heading" style={{ fontSize: 'var(--text-xl)', margin: '0 0 var(--space-2)' }}>
          Console Navigation Notice
        </h2>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-soft)',
            margin: '0 0 var(--space-4)',
            lineHeight: 1.5,
          }}
        >
          {error?.message || 'A rendering interruption occurred while presenting this section of the console.'}
          {' '}You may retry loading this view safely.
        </p>
        <button
          type="button"
          onClick={reset}
          className="btn-secondary"
        >
          Retry View
        </button>
      </div>
    </div>
  );
}

