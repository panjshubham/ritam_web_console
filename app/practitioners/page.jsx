// Client Component: Manages interactive filter selections (language & specialism) with strictly derived state calculation in render.
'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { filterPractitioners, sortPractitioners } from '@/lib/astronomy';

export default function PractitionersDirectoryPage() {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & sort criteria in React state, synchronized with URL (Module 09 Stretch requirement)
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSpecialism, setSelectedSpecialism] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [, startTransition] = useTransition();

  // Read initial sort from URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSort = params.get('sort');
      if (urlSort) {
        setSortBy(urlSort);
      }
    }
  }, []);

  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    setSortBy(nextSort);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextSort) {
        url.searchParams.set('sort', nextSort);
      } else {
        url.searchParams.delete('sort');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Load practitioners from our API route
  async function fetchPractitioners() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/practitioners');
      if (!res.ok) {
        throw new Error(`Failed to load practitioner directory (HTTP ${res.status}).`);
      }
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.error || 'Invalid practitioner response format.');
      }
      setPractitioners(data.data);
    } catch (err) {
      setError(err.message || 'Unable to connect to practitioner registry. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPractitioners();
  }, []);

  // DERIVED STATE: Filtered practitioners are calculated directly in render.
  // NEVER stored in a secondary useState via useEffect (Module 02 & Module 09 hard rule).
  const filteredPractitioners = filterPractitioners(practitioners, {
    language: selectedLanguage,
    specialism: selectedSpecialism,
  });

  const displayedPractitioners = sortPractitioners(filteredPractitioners, sortBy);

  // Extract unique languages and specialisms for filter dropdowns
  const availableLanguages = Array.from(
    new Set(practitioners.flatMap((p) => p.languages || []))
  ).sort();

  const availableSpecialisms = Array.from(
    new Set(practitioners.flatMap((p) => p.specialisms || []))
  ).sort();

  const handleResetFilters = () => {
    startTransition(() => {
      setSelectedLanguage('');
      setSelectedSpecialism('');
      setSortBy('');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.pathname);
      }
    });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <section aria-labelledby="directory-heading" style={{ marginBottom: 'var(--space-6)' }}>
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            margin: '0 0 var(--space-2)',
          }}
        >
          Practitioner Registry
        </p>
        <h1
          id="directory-heading"
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            margin: '0 0 var(--space-2)',
            color: 'var(--ink)',
            lineHeight: 1.15,
          }}
        >
          Vedic Jyotish & Vastu Specialists
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: 'var(--text-base)',
            margin: 0,
            maxWidth: '65ch',
          }}
        >
          Verified practitioners for life-transition counseling, Muhurta calculation, and space alignment.
        </p>
      </section>

      {/* Filter Toolbar */}
      <section
        aria-label="Filter practitioners"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            {/* Language filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label
                htmlFor="filter-language"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--ink)',
                }}
              >
                Language:
              </label>
              <select
                id="filter-language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--body)',
                  fontSize: 'var(--text-sm)',
                  minWidth: '150px',
                }}
              >
                <option value="">All Languages</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialism filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label
                htmlFor="filter-specialism"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--ink)',
                }}
              >
                Specialism:
              </label>
              <select
                id="filter-specialism"
                value={selectedSpecialism}
                onChange={(e) => setSelectedSpecialism(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--body)',
                  fontSize: 'var(--text-sm)',
                  minWidth: '160px',
                }}
              >
                <option value="">All Specialisms</option>
                {availableSpecialisms.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order control (Module 09 Stretch requirement) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label
                htmlFor="filter-sort"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--ink)',
                }}
              >
                Sort:
              </label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={handleSortChange}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--body)',
                  fontSize: 'var(--text-sm)',
                  minWidth: '160px',
                }}
              >
                <option value="">Default Order</option>
                <option value="experience-desc">Experience (High → Low)</option>
                <option value="experience-asc">Experience (Low → High)</option>
                <option value="name-asc">Name (A → Z)</option>
              </select>
            </div>

            {/* Reset button if filter is active */}
            {(selectedLanguage || selectedSpecialism || sortBy) && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--line)',
                  color: 'var(--ink-soft)',
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Result Count - Module 09 Requirement */}
          <div
            aria-live="polite"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--ink-soft)',
            }}
          >
            Showing {filteredPractitioners.length} of {practitioners.length} practitioners
          </div>
        </div>
      </section>

      {/* 4 Data States */}
      <section aria-live="polite">
        {/* State 1: Loading (Layout-holding Skeleton) */}
        {loading && (
          <div
            role="status"
            aria-label="Loading practitioner directory"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-5)',
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    className="skeleton-shimmer"
                    style={{
                      height: '22px',
                      width: '55%',
                      marginBottom: 'var(--space-3)',
                    }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{
                      height: '14px',
                      width: '90%',
                      marginBottom: 'var(--space-2)',
                    }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{
                      height: '14px',
                      width: '70%',
                      marginBottom: 'var(--space-4)',
                    }}
                  />
                </div>
                <div
                  className="skeleton-shimmer"
                  style={{
                    height: '28px',
                    width: '105px',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* State 2: Error with Retry */}
        {!loading && error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--crit)',
              borderLeft: '4px solid var(--crit)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)',
            }}
          >
            <h2
              style={{
                margin: '0 0 var(--space-2)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--crit)',
              }}
            >
              Directory Registry Notice
            </h2>
            <p style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
              {error}
            </p>
            <button
              type="button"
              onClick={fetchPractitioners}
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* State 3: Empty State (Zero matches is success, not error!) */}
        {!loading && !error && filteredPractitioners.length === 0 && (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-8)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                margin: '0 0 var(--space-2)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              No Practitioners Found
            </h2>
            <p
              style={{
                margin: '0 0 var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-soft)',
                maxWidth: '50ch',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              No verified astrologers match your selected criteria. Try adjusting your language or specialism filter.
            </p>
            {(selectedLanguage || selectedSpecialism) && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-sm)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Show All Practitioners
              </button>
            )}
          </div>
        )}

        {/* State 4: Success State (Grid of cards) */}
        {!loading && !error && displayedPractitioners.length > 0 && (
          <ul
            aria-label="Practitioner list"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {displayedPractitioners.map((prac) => (
              <li key={prac.id}>
                <article
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
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
                        {prac.pseudonym}
                      </h2>
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--brass)',
                          fontWeight: 500,
                          backgroundColor: 'var(--surface-2)',
                          border: '1px solid var(--line)',
                          padding: '1px var(--space-2)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {prac.priceBand}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '0 0 var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.5,
                      }}
                    >
                      {prac.bio}
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
                      {prac.specialisms?.map((spec) => (
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
                      Languages: {prac.languages?.join(', ')} · {prac.experienceYears}y experience
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/practitioners/${prac.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        backgroundColor: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        color: 'var(--ink)',
                        padding: 'var(--space-2) var(--space-3)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 500,
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease',
                      }}
                    >
                      View Profile →
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

