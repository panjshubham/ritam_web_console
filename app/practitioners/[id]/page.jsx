// Server Component: Renders practitioner profile details directly on the server at request time, eliminating client-side fetch waterfalls and client bundle overhead.
import Link from 'next/link';
import practitioners from '@/data/practitioners.json';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const practitioner = practitioners.find((p) => p.id === resolvedParams.id);
  if (!practitioner) {
    return { title: 'Practitioner Not Found · Ritam Console' };
  }
  return {
    title: `${practitioner.pseudonym} · Ritam Practitioner Console`,
    description: practitioner.bio,
  };
}

export default async function PractitionerDetailPage({ params }) {
  const resolvedParams = await params;
  const practitioner = practitioners.find((p) => p.id === resolvedParams.id);

  if (!practitioner) {
    return (
      <div className="page-container">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            href="/practitioners"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-soft)',
              textDecoration: 'none',
            }}
          >
            ← Return to Practitioner Registry
          </Link>
        </nav>

        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--ink)',
              margin: '0 0 var(--space-2)',
            }}
          >
            Practitioner Not Found
          </h1>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-soft)',
              margin: '0 0 var(--space-4)',
            }}
          >
            No active practitioner record matches identifier “{resolvedParams.id}”.
          </p>
          <Link
            href="/practitioners"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            Browse Registry
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-6)' }}>
        <Link
          href="/practitioners"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-soft)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
          }}
        >
          ← Return to Practitioner Registry
        </Link>
      </nav>

      {/* Profile Card */}
      <article className="detail-card">
        <header
          style={{
            borderBottom: '1px solid var(--line-soft)',
            paddingBottom: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Verified Practitioner Profile
              </span>
              <h1 className="page-heading" style={{ margin: 0 }}>
                {practitioner.pseudonym}
              </h1>
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--brass)',
                  border: '1px solid var(--line)',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-2)',
                  display: 'inline-block',
                }}
              >
                Price Band: {practitioner.priceBand}
              </span>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Biography */}
          <section>
            <h2
              style={{
                fontFamily: 'var(--display)',
                fontSize: 'var(--text-lg)',
                margin: '0 0 var(--space-2)',
                color: 'var(--ink)',
              }}
            >
              Consultation Focus & Approach
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-base)',
                color: 'var(--ink-soft)',
                lineHeight: 1.6,
              }}
            >
              {practitioner.bio}
            </p>
          </section>

          {/* Details Table */}
          <section>
            <h2
              style={{
                fontFamily: 'var(--display)',
                fontSize: 'var(--text-lg)',
                margin: '0 0 var(--space-3)',
                color: 'var(--ink)',
              }}
            >
              Qualifications & Alignment
            </h2>

            <dl className="detail-dl">
              <dt>Specialisms:</dt>
              <dd>{practitioner.specialisms?.join(', ')}</dd>

              <dt>Consultation Languages:</dt>
              <dd>{practitioner.languages?.join(', ')}</dd>

              <dt>Verified Experience:</dt>
              <dd>{practitioner.experienceYears} Years in continuous practice</dd>

              <dt>Registry ID:</dt>
              <dd
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-faint)',
                }}
              >
                {practitioner.id}
              </dd>
            </dl>
          </section>

          {/* Boundaries & Disclaimers */}
          <section
            style={{
              backgroundColor: 'var(--surface-2)',
              borderLeft: '3px solid var(--brass)',
              padding: 'var(--space-4)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              fontSize: 'var(--text-xs)',
              color: 'var(--ink-soft)',
            }}
          >
            <strong>Practitioner Ethics Covenant:</strong> In accordance with Ritam governance (Module 07),
            all consultations adhere strictly to non-fatalistic principles. Consultations provide planetary
            period timing perspectives without fear-based claims, medical guarantees, or emergency intervention promises.
          </section>
        </div>
      </article>
    </div>
  );
}

