import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Sun Times Component State Transitions (Tests 4, 5, 6)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('Test 4: shows loading state while calculation is in-flight', () => {
    // Hold the promise unresolved to assert loading state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<HomePage />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
    expect(screen.getByText(/computing ephemeris coordinates/i)).toBeInTheDocument();
  });

  it('Test 5: displays formatted solar times upon successful resolution', async () => {
    const mockSuccessResponse = {
      status: 'OK',
      results: {
        sunrise: '2026-11-01T06:14:00+00:00',
        sunset: '2026-11-01T17:54:00+00:00',
        solar_noon: '2026-11-01T12:04:00+00:00',
        day_length: 42000,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockSuccessResponse,
    });

    render(<HomePage />);

    // Wait for the loading state to clear and cards to appear
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/sunrise \(surya udaya\)/i)).toBeInTheDocument();
    expect(screen.getByText(/sunset \(surya asta\)/i)).toBeInTheDocument();
    expect(screen.getByText(/total day length \(dina mana\)/i)).toBeInTheDocument();
    expect(screen.getByText(/11h 40m/i)).toBeInTheDocument();
  });

  it('Test 6: displays error state with retry action when request fails or returns INVALID_REQUEST', async () => {
    // Test the critical Module 04 trap: HTTP 200 with INVALID_REQUEST status
    const mockInvalidResponse = {
      status: 'INVALID_REQUEST',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockInvalidResponse,
    });

    render(<HomePage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText(/astronomical calculation notice/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry calculation/i })).toBeInTheDocument();
  });

  it('Test 6b: displays error state when network throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connectivity lost'));

    render(<HomePage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText(/network connectivity lost/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry calculation/i })).toBeInTheDocument();
  });
});

