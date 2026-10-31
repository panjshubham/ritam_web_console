'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to fetch sunrise and sunset data from sunrise-sunset.org.
 * Handles race conditions via AbortController, traps HTTP 200 "INVALID_REQUEST",
 * and provides retry capability.
 * 
 * @param {Object} coords - { lat: number, lng: number, date?: string }
 * @returns {Object} { data, error, loading, refetch }
 */
export function useSunTimes({ lat, lng, date } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const abortControllerRef = useRef(null);

  const refetch = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Abort any in-flight request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function fetchTimes() {
      setLoading(true);
      setError(null);

      // Validate latitude and longitude inputs
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        setLoading(false);
        setError('Valid geographic coordinates (latitude and longitude) are required.');
        setData(null);
        return;
      }

      // Format query using URLSearchParams (Module 04 requirement: no string concatenation with +)
      const targetDate = date || new Date().toISOString().split('T')[0];
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        date: targetDate,
        formatted: '0',
      });

      const url = `https://api.sunrise-sunset.org/json?${params.toString()}`;

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Temporal calculation service error (HTTP ${response.status}).`);
        }

        const json = await response.json();

        // Critical Module 04 check:
        // sunrise-sunset.org returns HTTP 200 with status: "INVALID_REQUEST" on bad parameters.
        if (json.status !== 'OK') {
          throw new Error(
            json.status === 'INVALID_REQUEST'
              ? 'Observation coordinates outside computational range. Please select a valid city.'
              : `Astronomical data unavailable (${json.status || 'Unknown'}).`
          );
        }

        if (!json.results || !json.results.sunrise || !json.results.sunset) {
          setData(null); // Triggers empty state
        } else {
          setData(json.results);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // Normal cancellation due to user switching city quickly; ignore
          return;
        }
        setError(err.message || 'Unable to retrieve solar coordinates. Please verify your connection.');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTimes();

    return () => {
      controller.abort();
    };
  }, [lat, lng, date, retryTrigger]);

  return { data, error, loading, refetch };
}

