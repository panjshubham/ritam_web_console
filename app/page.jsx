// Client Component: Manages interactive city selection, user event handling, and client-side lifecycle data fetching via custom hook.
'use client';

import { useState, useEffect } from 'react';
import { CITIES, DEFAULT_CITY } from '@/lib/cities';
import { useSunTimes } from '@/hooks/useSunTimes';
import { formatSunTime, calculateDayLength } from '@/lib/astronomy';
import { CityPicker } from './components/CityPicker';
import { SolarCard } from './components/SolarCard';
import { ErrorNotice, EmptyNotice } from './components/StateNotice';

export default function HomePage() {
  const [selectedCityId, setSelectedCityId] = useState(DEFAULT_CITY.id);

  // Restore saved city from localStorage after client hydration to prevent server/client mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ritam_chosen_city');
      if (saved && CITIES.some((c) => c.id === saved)) {
        setSelectedCityId(saved);
      }
    } catch (err) {
      // Fallback gracefully on storage access errors
    }
  }, []);

  const handleCityChange = (e) => {
    const nextCityId = e.target.value;
    setSelectedCityId(nextCityId);
    try {
      localStorage.setItem('ritam_chosen_city', nextCityId);
    } catch (err) {
      // Ignore write errors (e.g. private mode restrictions)
    }
  };

  const selectedCity = CITIES.find((c) => c.id === selectedCityId) || DEFAULT_CITY;

  const { data, error, loading, refetch } = useSunTimes({
    lat: selectedCity.lat,
    lng: selectedCity.lng,
  });

  return (
    <div className="page-container">
      {/* Header Landmark */}
      <section aria-labelledby="page-heading" style={{ marginBottom: 'var(--space-6)' }}>
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
          Astronomical Observations
        </p>
        <h1 id="page-heading" className="page-heading" style={{ margin: '0 0 var(--space-2)' }}>
          Solar Coordinates & Day Division
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: 'var(--text-base)',
            margin: 0,
            maxWidth: '65ch',
          }}
        >
          Daily solar rising, setting, and day length intervals across key observation nodes in India.
        </p>
      </section>

      {/* Observation Node Selection */}
      <CityPicker
        cities={CITIES}
        selectedCityId={selectedCityId}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      {/* 4 Data States Representation */}
      <section aria-live="polite" style={{ minHeight: '260px' }}>
        {/* State 1: Loading */}
        {loading && (
          <div
            role="status"
            aria-label="Calculating solar timings"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--brass)',
                }}
              >
                Computing ephemeris coordinates for {selectedCity.name}…
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
                Resolving horizon crossing moments.
              </p>
            </div>

            {/* Skeleton placeholders */}
            <div className="sun-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="sun-card skeleton-shimmer" style={{ minHeight: '130px' }} />
              ))}
            </div>
          </div>
        )}

        {/* State 2: Error (with calm retry action) */}
        {!loading && error && (
          <ErrorNotice
            title="Astronomical Calculation Notice"
            message={error}
            retryLabel="Retry Calculation"
            onRetry={refetch}
          />
        )}

        {/* State 3: Empty Success */}
        {!loading && !error && !data && (
          <EmptyNotice
            title="No Solar Ephemeris Available"
            message="No solar timing points returned for this coordinate on the chosen date."
          />
        )}

        {/* State 4: Success */}
        {!loading && !error && data && (
          <div className="sun-grid">
            <SolarCard
              label="Sunrise (Surya Udaya)"
              value={formatSunTime(data.sunrise)}
              description="Calculated at true astronomical horizon"
              accentVar="var(--accent)"
            />
            <SolarCard
              label="Sunset (Surya Asta)"
              value={formatSunTime(data.sunset)}
              description="Upper limb disappearance beneath horizon"
              accentVar="var(--brass)"
            />
            <SolarCard
              label="Total Day Length (Dina Mana)"
              value={calculateDayLength(data.sunrise, data.sunset)}
              description="Duration of diurnal light period"
              accentVar="var(--ok)"
            />
            <SolarCard
              label="Solar Noon (Madhya Ahna)"
              value={formatSunTime(data.solar_noon)}
              description="Zenith transit along local meridian"
              accentVar="var(--violet)"
            />
          </div>
        )}
      </section>
    </div>
  );
}
