import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PractitionersDirectoryPage from '@/app/practitioners/page';

describe('Practitioners Directory Component (Tests 1, 2, 3)', () => {
  const originalFetch = global.fetch;

  const mockPractitionersList = [
    {
      id: 'prac-1',
      pseudonym: 'Ananya Vani',
      languages: ['Hindi', 'English'],
      specialisms: ['Muhurta'],
      experienceYears: 12,
      priceBand: '₹₹',
      bio: 'Expert in Muhurta calculations and life transitions.',
    },
    {
      id: 'prac-2',
      pseudonym: 'Raghavan Shastry',
      languages: ['Kannada', 'English'],
      specialisms: ['Career'],
      experienceYears: 20,
      priceBand: '₹₹₹',
      bio: 'Focused on career analysis and dasha cycles.',
    },
    {
      id: 'prac-3',
      pseudonym: 'Somnath Da',
      languages: ['Bengali', 'Hindi'],
      specialisms: ['Vastu'],
      experienceYears: 15,
      priceBand: '₹',
      bio: 'Prashna and domestic Vastu orientation.',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        count: mockPractitionersList.length,
        data: mockPractitionersList,
      }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('Test 1: renders the rows it is given', async () => {
    render(<PractitionersDirectoryPage />);

    // Wait for the data to resolve
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check headings for all practitioners rendered
    expect(screen.getByRole('heading', { level: 2, name: 'Ananya Vani' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Raghavan Shastry' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Somnath Da' })).toBeInTheDocument();

    // Check count text
    expect(screen.getByText(/showing 3 of 3 practitioners/i)).toBeInTheDocument();
  });

  it('Test 2: choosing a language filter narrows the list via derived state', async () => {
    const user = userEvent.setup();
    render(<PractitionersDirectoryPage />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const languageSelect = screen.getByLabelText(/language:/i);

    // Select Kannada
    await user.selectOptions(languageSelect, 'Kannada');

    // Only Raghavan Shastry knows Kannada
    expect(screen.getByRole('heading', { level: 2, name: 'Raghavan Shastry' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Ananya Vani' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Somnath Da' })).not.toBeInTheDocument();

    expect(screen.getByText(/showing 1 of 3 practitioners/i)).toBeInTheDocument();
  });

  it('Test 3: a filter combination that matches nothing displays empty state (empty ≠ error)', async () => {
    const user = userEvent.setup();
    render(<PractitionersDirectoryPage />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const languageSelect = screen.getByLabelText(/language:/i);
    const specialismSelect = screen.getByLabelText(/specialism:/i);

    // Select Bengali + Muhurta (none match)
    await user.selectOptions(languageSelect, 'Bengali');
    await user.selectOptions(specialismSelect, 'Muhurta');

    expect(screen.getByRole('heading', { level: 2, name: /no practitioners found/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Crucial: must NOT be an error alert
    expect(screen.getByText(/showing 0 of 3 practitioners/i)).toBeInTheDocument();

    // Resetting filters restores full list
    const resetButton = screen.getByRole('button', { name: /show all practitioners/i });
    await user.click(resetButton);

    expect(screen.getByRole('heading', { level: 2, name: 'Ananya Vani' })).toBeInTheDocument();
    expect(screen.getByText(/showing 3 of 3 practitioners/i)).toBeInTheDocument();
  });
});

