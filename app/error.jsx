// Client Component: Next.js route error boundary providing graceful failure capture and reset capabilities.
'use client';

export default function GlobalError({ reset }) {
  return (
    <div className="page-container" style={{ paddingTop: 'var(--space-10)' }}>
      <div
        role="alert"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--crit)',
          borderLeft: '4px solid var(--crit)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'var(--text-xl)',
            color: 'var(--crit)',
            margin: '0 0 var(--space-2)',
          }}
        >
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
          A rendering interruption occurred while presenting this section of the console.
          You may retry loading this view safely.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          Retry View
        </button>
      </div>
    </div>
  );
}

