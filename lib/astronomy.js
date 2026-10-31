/**
 * Pure functions for sun-times formatting and time arithmetic.
 * Extracted according to Module 06 & 08 principles for deterministic testing.
 */

/**
 * Format an ISO string or time string into a clean, human-readable format (e.g., '06:14 AM' or '06:14:22').
 * Handles empty, invalid, and standard ISO formats gracefully.
 * 
 * @param {string|null|undefined} timeString - ISO date-time string (e.g. "2026-11-01T06:14:02+00:00") or time string.
 * @returns {string} Human-readable time, or '—' if unavailable or invalid.
 */
export function formatSunTime(timeString) {
  if (!timeString || typeof timeString !== 'string') {
    return '—';
  }

  const trimmed = timeString.trim();
  if (trimmed === '') {
    return '—';
  }

  // Handle ISO 8601 strings
  const parsedDate = new Date(trimmed);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  }

  // If it's already a plain time string (e.g., "6:14:02 AM"), return as is
  return trimmed;
}

/**
 * Calculate day length difference in hours and minutes from two ISO date strings.
 * 
 * @param {string|null|undefined} sunrise - Sunrise ISO string
 * @param {string|null|undefined} sunset - Sunset ISO string
 * @returns {string} Formatted duration string e.g. "11h 42m", or "—" if invalid.
 */
export function calculateDayLength(sunrise, sunset) {
  if (!sunrise || !sunset) {
    return '—';
  }

  const start = new Date(sunrise).getTime();
  const end = new Date(sunset).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    return '—';
  }

  const diffMs = end - start;
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

/**
 * Filter practitioners by language and specialism.
 * Pure function with derived output.
 * 
 * @param {Array} list - Array of practitioner records
 * @param {Object} filters - { language: string, specialism: string }
 * @returns {Array} Filtered list
 */
export function filterPractitioners(list, filters = {}) {
  if (!Array.isArray(list)) {
    return [];
  }

  const { language = '', specialism = '' } = filters;
  const langQuery = language.trim().toLowerCase();
  const specQuery = specialism.trim().toLowerCase();

  return list.filter((item) => {
    if (!item) return false;

    const matchesLanguage = !langQuery || (
      Array.isArray(item.languages) &&
      item.languages.some((l) => l.toLowerCase() === langQuery)
    );

    const matchesSpecialism = !specQuery || (
      Array.isArray(item.specialisms) &&
      item.specialisms.some((s) => s.toLowerCase() === specQuery)
    );

    return matchesLanguage && matchesSpecialism;
  });
}

/**
 * Pure function to sort practitioner list immutably (Module 09 Stretch requirement).
 * 
 * @param {Array} list - Array of practitioners
 * @param {string} sortBy - Sort key ('experience-desc', 'experience-asc', 'name-asc')
 * @returns {Array} Sorted array
 */
export function sortPractitioners(list, sortBy = '') {
  if (!Array.isArray(list)) return [];
  const copy = [...list];

  if (sortBy === 'experience-desc') {
    return copy.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
  }
  if (sortBy === 'experience-asc') {
    return copy.sort((a, b) => (a.experienceYears || 0) - (b.experienceYears || 0));
  }
  if (sortBy === 'name-asc') {
    return copy.sort((a, b) => (a.pseudonym || '').localeCompare(b.pseudonym || ''));
  }
  return copy;
}

