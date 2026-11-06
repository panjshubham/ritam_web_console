// Server Component: Calm, accessible 404 fallback page matching Ritam brand tone.
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-container" style={{ paddingTop: 'var(--space-10)' }}>
      <section
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
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: 'var(--space-2)',
          }}
        >
          HTTP 404
        </span>
        <h1
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--ink)',
            margin: '0 0 var(--space-2)',
          }}
        >
          Page Not Located
        </h1>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-soft)',
            margin: '0 0 var(--space-5)',
            lineHeight: 1.5,
          }}
        >
          The requested console endpoint is not recognized. Please return to the solar calculations or practitioner directory.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Link href="/" className="btn-secondary">
            Solar Ephemeris
          </Link>
          <Link href="/practitioners" className="btn-secondary">
            Practitioner Directory
          </Link>
        </div>
      </section>
    </div>
  );
}

