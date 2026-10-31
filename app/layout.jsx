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
    <html lang="en">
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
            padding: 'var(--space-4) 0',
          }}
        >
          <div
            className="page-container"
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <div>
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

            <nav
              aria-label="Main navigation"
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'center',
              }}
            >
              <Link
                href="/"
                style={{
                  color: 'var(--ink)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Sun Times
              </Link>
              <Link
                href="/practitioners"
                style={{
                  color: 'var(--ink)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
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
            fontSize: 'var(--text-xs)',
          }}
        >
          <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <p style={{ margin: 0 }}>
              Ritam Temporal Systems · Observational Ephemeris & Panchanga Console · All measurements computed for local coordinates.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

