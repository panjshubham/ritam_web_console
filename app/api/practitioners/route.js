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

/**
 * POST handler for /api/practitioners
 * Validates new practitioner submissions (Module 09 Stretch requirement)
 */
export async function POST(request) {
  try {
    const payload = await request.json();

    const { pseudonym, languages, specialisms, priceBand, experienceYears, bio } = payload || {};

    if (!pseudonym || typeof pseudonym !== 'string' || pseudonym.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A valid practitioner pseudonym is required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(languages) || languages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one consultation language must be specified.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(specialisms) || specialisms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one astrological specialism must be selected.' },
        { status: 400 }
      );
    }

    const validPriceBands = ['₹', '₹₹', '₹₹₹'];
    if (!priceBand || !validPriceBands.includes(priceBand)) {
      return NextResponse.json(
        { success: false, error: 'Price band must be one of: ₹, ₹₹, ₹₹₹.' },
        { status: 400 }
      );
    }

    const expNum = Number(experienceYears);
    if (isNaN(expNum) || expNum < 0) {
      return NextResponse.json(
        { success: false, error: 'Experience years must be a positive number.' },
        { status: 400 }
      );
    }

    if (!bio || typeof bio !== 'string' || bio.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'A brief practice biography (at least 10 characters) is required.' },
        { status: 400 }
      );
    }

    const newPractitioner = {
      id: `prac-${Date.now().toString().slice(-4)}`,
      name: pseudonym.trim(),
      pseudonym: pseudonym.trim(),
      languages: languages.map((l) => String(l).trim()),
      specialisms: specialisms.map((s) => String(s).trim()),
      experienceYears: expNum,
      priceBand,
      bio: bio.trim(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Practitioner onboarded successfully into provisional registry.',
        data: newPractitioner,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Malformed JSON payload provided in registration request.',
      },
      { status: 400 }
    );
  }
}

