'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const refetch = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTimes() {
      setLoading(true);
      setError(null);

      // Validate latitude and longitude inputs
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        if (!controller.signal.aborted) {
          setLoading(false);
          setError('Valid geographic coordinates (latitude and longitude) are required.');
          setData(null);
        }
        return;
      }

      // Build target date in Asia/Kolkata timezone (ISO YYYY-MM-DD), avoiding UTC midnight mismatch
      const targetDate =
        date ||
        new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date());

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
          throw new Error("Couldn't load sun times. Check your connection and try again.");
        }

        const json = await response.json();

        // Critical Module 04 check:
        // sunrise-sunset.org returns HTTP 200 with status: "INVALID_REQUEST" on bad parameters.
        if (json.status !== 'OK') {
          throw new Error(
            json.status === 'INVALID_REQUEST'
              ? 'Observation coordinates outside computational range. Please select a valid city.'
              : 'Astronomical data unavailable. Please select another city.'
          );
        }

        if (!controller.signal.aborted) {
          if (!json.results || !json.results.sunrise || !json.results.sunset) {
            setData(null); // Triggers empty state
          } else {
            setData(json.results);
          }
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) {
          // Normal cancellation due to city switch or unmount; ignore
          return;
        }

        // Map network failures and raw fetch errors ("Failed to fetch", TypeError) to a calm, human-friendly message
        if (
          err instanceof TypeError ||
          err.message === 'Failed to fetch' ||
          err.message.toLowerCase().includes('fetch') ||
          err.message.toLowerCase().includes('network')
        ) {
          setError("Couldn't load sun times. Check your connection and try again.");
        } else {
          setError(err.message || "Couldn't load sun times. Check your connection and try again.");
        }
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTimes();

    return () => {
      controller.abort();
    };
  }, [lat, lng, date, retryTrigger]);

  return { data, error, loading, refetch };
}
