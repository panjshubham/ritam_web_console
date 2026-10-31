import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

describe('Sun Times Component State Transitions (Tests 4, 5, 6)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('Test 4: shows loading state with role="status" while calculation is in-flight', () => {
    // Hold the promise unresolved to assert loading state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<HomePage />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
  });

  it('Test 5: displays solar time cards upon successful resolution', async () => {
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

    // Wait for the loading state to clear
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Behavioural assertion: accessible article landmarks represent the solar timing cards
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThanOrEqual(3);
  });

  it('Test 6: displays error alert with retry button when API returns INVALID_REQUEST', async () => {
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

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('Test 6b: displays error alert with retry button when network failure occurs', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    render(<HomePage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('Test 6c: clicking Retry fetches again and recovers to show data', async () => {
    const user = userEvent.setup();
    const mockSuccessResponse = {
      status: 'OK',
      results: {
        sunrise: '2026-11-01T06:14:00+00:00',
        sunset: '2026-11-01T17:54:00+00:00',
        solar_noon: '2026-11-01T12:04:00+00:00',
        day_length: 42000,
      },
    };

    // First attempt fails with network error; second attempt succeeds
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockSuccessResponse,
      });

    render(<HomePage />);

    // Initially in error state
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    // Trigger retry
    await user.click(retryButton);

    // Assert recovery: error alert clears and data articles appear
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThanOrEqual(3);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
