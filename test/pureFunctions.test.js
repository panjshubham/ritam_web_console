import { describe, it, expect } from 'vitest';
import { formatSunTime, calculateDayLength, filterPractitioners, sortPractitioners } from '@/lib/astronomy';

describe('Test 8: Pure astronomical calculation and filtering functions', () => {
  describe('formatSunTime', () => {
    it('normal case: formats ISO UTC timestamp to human-readable Indian time string', () => {
      // 2026-11-01T00:30:00.000Z -> 6:00:00 AM IST (+5:30)
      const formatted = formatSunTime('2026-11-01T00:30:00.000Z');
      expect(formatted).toMatch(/0?6:00\s*(AM|am)/i);
    });

    it('edge case: gracefully returns dash when input is null, undefined, empty, or invalid', () => {
      expect(formatSunTime(null)).toBe('—');
      expect(formatSunTime(undefined)).toBe('—');
      expect(formatSunTime('')).toBe('—');
      expect(formatSunTime('   ')).toBe('—');
      expect(formatSunTime(12345)).toBe('—');
    });

    it('boundary case: returns raw time string if already non-ISO time format', () => {
      expect(formatSunTime('06:14:02 AM')).toBe('06:14:02 AM');
    });
  });

  describe('calculateDayLength', () => {
    it('normal case: computes difference between sunrise and sunset', () => {
      const sunrise = '2026-11-01T06:00:00.000Z';
      const sunset = '2026-11-01T17:45:00.000Z';
      expect(calculateDayLength(sunrise, sunset)).toBe('11h 45m');
    });

    it('edge case: returns dash when sunset occurs before sunrise or timestamps are invalid', () => {
      expect(calculateDayLength(null, null)).toBe('—');
      expect(calculateDayLength('invalid', 'invalid')).toBe('—');
      // Sunset before sunrise
      expect(calculateDayLength('2026-11-01T18:00:00.000Z', '2026-11-01T06:00:00.000Z')).toBe('—');
    });
  });

  describe('filterPractitioners', () => {
    const sample = [
      { id: '1', pseudonym: 'A', languages: ['Hindi', 'English'], specialisms: ['Muhurta'] },
      { id: '2', pseudonym: 'B', languages: ['Kannada'], specialisms: ['Career'] },
      { id: '3', pseudonym: 'C', languages: ['Hindi', 'Kannada'], specialisms: ['Kundali'] },
    ];

    it('normal case: filters accurately by language and specialism', () => {
      const byLang = filterPractitioners(sample, { language: 'Hindi' });
      expect(byLang).toHaveLength(2);
      expect(byLang.map((p) => p.id)).toEqual(['1', '3']);

      const byBoth = filterPractitioners(sample, { language: 'Hindi', specialism: 'Muhurta' });
      expect(byBoth).toHaveLength(1);
      expect(byBoth[0].id).toBe('1');
    });

    it('edge case: returns empty array when list is null or empty', () => {
      expect(filterPractitioners(null, { language: 'Hindi' })).toEqual([]);
      expect(filterPractitioners([], { language: 'Hindi' })).toEqual([]);
    });
  });

  describe('sortPractitioners (Module 09 Stretch)', () => {
    const sample = [
      { id: '1', pseudonym: 'Somnath', experienceYears: 10 },
      { id: '2', pseudonym: 'Ananya', experienceYears: 20 },
      { id: '3', pseudonym: 'Bhaskar', experienceYears: 5 },
    ];

    it('sorts descending by experience', () => {
      const sorted = sortPractitioners(sample, 'experience-desc');
      expect(sorted.map((s) => s.id)).toEqual(['2', '1', '3']);
    });

    it('sorts ascending by experience', () => {
      const sorted = sortPractitioners(sample, 'experience-asc');
      expect(sorted.map((s) => s.id)).toEqual(['3', '1', '2']);
    });

    it('sorts ascending by pseudonym', () => {
      const sorted = sortPractitioners(sample, 'name-asc');
      expect(sorted.map((s) => s.pseudonym)).toEqual(['Ananya', 'Bhaskar', 'Somnath']);
    });

    it('returns empty array when list is invalid', () => {
      expect(sortPractitioners(null, 'experience-desc')).toEqual([]);
    });
  });
});

