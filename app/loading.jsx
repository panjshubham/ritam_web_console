// Server Component: Instant Next.js route transition loading shell without layout shift.
export default function GlobalLoading() {
  return (
    <div className="page-container" style={{ paddingTop: 'var(--space-10)' }}>
      <div
        role="status"
        aria-label="Loading page"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-8)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--brass)',
            margin: 0,
          }}
        >
          Loading Ritam Web Console…
        </p>
      </div>
    </div>
  );
}
