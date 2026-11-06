// Client Component: Manages interactive filter selections (language & specialism) with strictly derived state calculation in render.
'use client';

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import { filterPractitioners, sortPractitioners } from '@/lib/astronomy';
import { PractitionerCard } from '../components/PractitionerCard';
import { FilterToolbar } from '../components/FilterToolbar';
import { ErrorNotice, EmptyNotice } from '../components/StateNotice';

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
  const fetchPractitioners = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchPractitioners();
  }, [fetchPractitioners]);

  // DERIVED STATE: Filtered practitioners are calculated directly in render.
  // NEVER stored in a secondary useState via useEffect (Module 02 & Module 09 hard rule).
  const filteredPractitioners = filterPractitioners(practitioners, {
    language: selectedLanguage,
    specialism: selectedSpecialism,
  });

  const displayedPractitioners = sortPractitioners(filteredPractitioners, sortBy);

  // Memoized unique filter options derived cleanly from current practitioner dataset
  const availableLanguages = useMemo(
    () => Array.from(new Set(practitioners.flatMap((p) => p.languages || []))).sort(),
    [practitioners]
  );

  const availableSpecialisms = useMemo(
    () => Array.from(new Set(practitioners.flatMap((p) => p.specialisms || []))).sort(),
    [practitioners]
  );

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
      {/* Header Landmark */}
      <section aria-labelledby="directory-heading" style={{ marginBottom: 'var(--space-6)' }}>
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            margin: '0 0 var(--space-2)',
          }}
        >
          Practitioner Registry
        </p>
        <h1 id="directory-heading" className="page-heading" style={{ margin: '0 0 var(--space-2)' }}>
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
      <FilterToolbar
        selectedLanguage={selectedLanguage}
        onLanguageChange={(e) => setSelectedLanguage(e.target.value)}
        availableLanguages={availableLanguages}
        selectedSpecialism={selectedSpecialism}
        onSpecialismChange={(e) => setSelectedSpecialism(e.target.value)}
        availableSpecialisms={availableSpecialisms}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        filteredCount={filteredPractitioners.length}
        totalCount={practitioners.length}
        onResetFilters={handleResetFilters}
      />

      {/* 4 Data States Representation */}
      <section aria-live="polite">
        {/* State 1: Loading Skeleton */}
        {loading && (
          <div role="status" aria-label="Loading practitioner directory" className="card-grid">
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

        {/* State 2: Error Notice with Retry */}
        {!loading && error && (
          <ErrorNotice
            title="Directory Registry Notice"
            message={error}
            retryLabel="Retry Connection"
            onRetry={fetchPractitioners}
          />
        )}

        {/* State 3: Empty State */}
        {!loading && !error && filteredPractitioners.length === 0 && (
          <EmptyNotice
            title="No Practitioners Found"
            message="No verified astrologers match your selected criteria. Try adjusting your language or specialism filter."
            actionLabel={selectedLanguage || selectedSpecialism ? 'Show All Practitioners' : undefined}
            onAction={handleResetFilters}
          />
        )}

        {/* State 4: Success Grid */}
        {!loading && !error && displayedPractitioners.length > 0 && (
          <ul
            aria-label="Practitioner list"
            className="card-grid"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {displayedPractitioners.map((prac) => (
              <li key={prac.id}>
                <PractitionerCard practitioner={prac} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
