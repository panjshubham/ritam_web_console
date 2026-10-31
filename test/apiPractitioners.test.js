import { describe, it, expect } from 'vitest';
import { GET, POST } from '@/app/api/practitioners/route';

describe('Test 7: Route handler at /api/practitioners', () => {
  it('returns status 200 and full practitioner list when no query params provided', async () => {
    const request = new Request('http://localhost:3000/api/practitioners');
    const response = await GET(request);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.count).toBeGreaterThanOrEqual(10);
    expect(body.count).toBe(body.data.length);

    // Verify record structure
    const first = body.data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('pseudonym');
    expect(first).toHaveProperty('languages');
    expect(first).toHaveProperty('specialisms');
    expect(first).toHaveProperty('priceBand');
  });

  it('filters accurately by language query parameter', async () => {
    const request = new Request('http://localhost:3000/api/practitioners?language=Kannada');
    const response = await GET(request);
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.filters.language).toBe('Kannada');
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((prac) => {
      expect(prac.languages).toContain('Kannada');
    });
  });

  it('filters accurately by specialism query parameter', async () => {
    const request = new Request('http://localhost:3000/api/practitioners?specialism=Muhurta');
    const response = await GET(request);
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.filters.specialism).toBe('Muhurta');
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((prac) => {
      expect(prac.specialisms).toContain('Muhurta');
    });
  });

  it('returns empty array when filter matches no records', async () => {
    const request = new Request('http://localhost:3000/api/practitioners?language=NonExistentLang');
    const response = await GET(request);
    const body = await response.json();

    expect(body.status || response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.count).toBe(0);
    expect(body.data).toEqual([]);
  });

  describe('Stretch: POST /api/practitioners onboarding endpoint', () => {
    it('creates a practitioner when valid payload provided', async () => {
      const validPayload = {
        pseudonym: 'Vidwan Shastri',
        languages: ['Hindi', 'Sanskrit'],
        specialisms: ['Muhurta', 'Kundali'],
        experienceYears: 16,
        priceBand: '₹₹',
        bio: 'Decades of classical Jyotish consultation for career transitions.',
      };

      const request = new Request('http://localhost:3000/api/practitioners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.pseudonym).toBe('Vidwan Shastri');
      expect(body.data.experienceYears).toBe(16);
    });

    it('returns status 400 when required fields are missing or invalid', async () => {
      const invalidPayload = {
        pseudonym: '', // empty
        languages: [],
      };

      const request = new Request('http://localhost:3000/api/practitioners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/pseudonym is required/i);
    });
  });
});

