// Server Component: Provides the static HTML shell, SEO metadata, and primary navigation without adding client bundle weight.
import './globals.css';
import Link from 'next/link';
import { ThemeToggle } from './components/ThemeToggle';

export const metadata = {
  title: 'Ritam Web Console',
  description: 'Observational Panchanga calculations, solar timing, and practitioner onboarding console.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Spectral:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header
          style={{
            borderBottom: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            padding: 'var(--space-3) 0',
          }}
        >
          <div className="page-container site-header-inner">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'var(--space-2)',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Ritam
                </span>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--ink-soft)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Console
                </span>
              </Link>
            </div>

            <nav aria-label="Main navigation" className="site-nav">
              <Link href="/" className="nav-link">
                Sun Times
              </Link>
              <Link href="/practitioners" className="nav-link">
                Practitioners
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main id="main-content" tabIndex="-1">
          {children}
        </main>

        <footer
          style={{
            borderTop: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink-soft)',
            padding: 'var(--space-6) 0',
            marginTop: 'var(--space-10)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Ritam Temporal Systems · Observational Ephemeris & Panchanga Console · All measurements computed for local coordinates.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

