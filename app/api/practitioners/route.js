import { NextResponse } from 'next/server';
import practitioners from '@/data/practitioners.json';
import { filterPractitioners } from '@/lib/astronomy';

/**
 * Route handler for /api/practitioners
 * Supports query parameters ?language= and ?specialism=
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || '';
    const specialism = searchParams.get('specialism') || '';

    const filtered = filterPractitioners(practitioners, { language, specialism });

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        filters: {
          language: language || null,
          specialism: specialism || null,
        },
        data: filtered,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to read practitioner registry data.',
      },
      { status: 500 }
    );
  }
}

