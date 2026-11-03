// Client Component: Manages interactive city selection, user event handling, and client-side lifecycle data fetching via custom hook.
'use client';

import { useState, useEffect } from 'react';
import { CITIES, DEFAULT_CITY } from '@/lib/cities';
import { useSunTimes } from '@/hooks/useSunTimes';
import { formatSunTime, calculateDayLength } from '@/lib/astronomy';

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
      <section
        aria-labelledby="page-heading"
        style={{
          marginBottom: 'var(--space-6)',
        }}
      >
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
        <h1
          id="page-heading"
          className="page-heading"
          style={{ margin: '0 0 var(--space-2)' }}
        >
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

      {/* City Picker Form */}
      <section
        aria-label="Observation node selection"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div className="city-picker-row">
          <label
            htmlFor="city-select"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
            }}
          >
            Observation Node:
          </label>
          <select
            id="city-select"
            value={selectedCityId}
            onChange={handleCityChange}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
              fontFamily: 'var(--body)',
              fontSize: 'var(--text-sm)',
            }}
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.state})
              </option>
            ))}
          </select>

          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-soft)',
            }}
          >
            {selectedCity.lat.toFixed(4)}°N, {selectedCity.lng.toFixed(4)}°E
          </span>
        </div>
      </section>

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
                <div
                  key={n}
                  className="sun-card skeleton-shimmer"
                  style={{
                    minHeight: '130px',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* State 2: Error (with calm retry action) */}
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
              Astronomical Calculation Notice
            </h2>
            <p
              style={{
                margin: '0 0 var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-soft)',
              }}
            >
              {error}
            </p>
            <button
              type="button"
              onClick={refetch}
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Retry Calculation
            </button>
          </div>
        )}

        {/* State 3: Empty Success */}
        {!loading && !error && !data && (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-6)',
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
              No Solar Ephemeris Available
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-soft)',
              }}
            >
              No solar timing points returned for this coordinate on the chosen date.
            </p>
          </div>
        )}

        {/* State 4: Success */}
        {!loading && !error && data && (
          <div className="sun-grid">
            {/* Sunrise Card */}
            <article
              className="sun-card interactive-card"
              style={{
                borderTop: '3px solid var(--accent)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Sunrise (Surya Udaya)
              </span>
              <div className="sun-value">
                {formatSunTime(data.sunrise)}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-soft)',
                }}
              >
                Calculated at true astronomical horizon
              </p>
            </article>

            {/* Sunset Card */}
            <article
              className="sun-card interactive-card"
              style={{
                borderTop: '3px solid var(--brass)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--brass)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Sunset (Surya Asta)
              </span>
              <div className="sun-value">
                {formatSunTime(data.sunset)}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-soft)',
                }}
              >
                Upper limb disappearance beneath horizon
              </p>
            </article>

            {/* Day Length Card */}
            <article
              className="sun-card interactive-card"
              style={{
                borderTop: '3px solid var(--ok)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ok)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Total Day Length (Dina Mana)
              </span>
              <div className="sun-value">
                {calculateDayLength(data.sunrise, data.sunset)}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-soft)',
                }}
              >
                Duration of diurnal light period
              </p>
            </article>

            {/* Solar Noon Card */}
            <article
              className="sun-card interactive-card"
              style={{
                borderTop: '3px solid var(--violet)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--violet)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Solar Noon (Madhya Ahna)
              </span>
              <div className="sun-value">
                {formatSunTime(data.solar_noon)}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-soft)',
                }}
              >
                Zenith transit along local meridian
              </p>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}

