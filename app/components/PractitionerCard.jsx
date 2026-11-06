import Link from 'next/link';

// Presentation Component: Renders an individual practitioner profile card in the directory list.
export function PractitionerCard({ practitioner }) {
  const { id, pseudonym, priceBand, bio, specialisms, languages, experienceYears } = practitioner;

  return (
    <article className="responsive-card interactive-card">
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--text-lg)',
              fontFamily: 'var(--display)',
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            {pseudonym}
          </h2>
          <span className="badge-brass">{priceBand}</span>
        </div>

        <p
          style={{
            margin: '0 0 var(--space-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-soft)',
            lineHeight: 1.5,
          }}
        >
          {bio}
        </p>

        {/* Specialisms badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-3)',
          }}
        >
          {specialisms?.map((spec) => (
            <span key={spec} className="badge-tag">
              {spec}
            </span>
          ))}
        </div>

        {/* Languages */}
        <p
          style={{
            margin: '0 0 var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-faint)',
          }}
        >
          Languages: {languages?.join(', ')} · {experienceYears}y experience
        </p>
      </div>

      <div>
        <Link href={`/practitioners/${id}`} className="mobile-action-button">
          View Profile →
        </Link>
      </div>
    </article>
  );
}

