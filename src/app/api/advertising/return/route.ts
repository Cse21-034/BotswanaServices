/**
 * POST /api/advertising/return
 * PayGate posts to this URL after payment (browser form POST).
 * The reference is in the URL query string we set; PayGate adds its own
 * form fields (PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM) to the body.
 * We redirect to the success page as a GET to avoid Next.js CSRF errors.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getOrigin(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

async function getBusinessId(reference: string): Promise<string | null> {
  try {
    const payment = await prisma.adPayment.findUnique({
      where: { transactionRef: reference },
      include: { adSubscription: { select: { businessId: true } } },
    });
    return payment?.adSubscription?.businessId || null;
  } catch {
    // Fall back to parsing the reference string: AD_{businessId}_{packageId}_{ts}
    const parts = reference.split('_');
    return parts[1] || null;
  }
}

export async function POST(request: NextRequest) {
  const origin = getOrigin(request);
  try {
    // Reference is in OUR query string — PayGate preserves it on the return POST
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference') || '';

    console.log('[AdReturn] POST from PayGate, reference:', reference);

    if (!reference) {
      console.error('[AdReturn] No reference in query string');
      return NextResponse.redirect(`${origin}/`, { status: 303 });
    }

    const businessId = await getBusinessId(reference);

    if (!businessId) {
      console.error('[AdReturn] Could not resolve businessId for reference:', reference);
      return NextResponse.redirect(`${origin}/`, { status: 303 });
    }

    const successUrl = `${origin}/business/${businessId}/ads/success?reference=${encodeURIComponent(reference)}`;
    console.log('[AdReturn] Redirecting to:', successUrl);
    return NextResponse.redirect(successUrl, { status: 303 });
  } catch (error) {
    console.error('[AdReturn] Error:', error);
    return NextResponse.redirect(`${origin}/`, { status: 303 });
  }
}

// Handle direct GET navigation (e.g. user refreshes the return URL)
export async function GET(request: NextRequest) {
  const origin = getOrigin(request);
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference') || '';

    if (!reference) {
      return NextResponse.redirect(`${origin}/`, { status: 303 });
    }

    const businessId = await getBusinessId(reference);

    if (!businessId) {
      return NextResponse.redirect(`${origin}/`, { status: 303 });
    }

    return NextResponse.redirect(
      `${origin}/business/${businessId}/ads/success?reference=${encodeURIComponent(reference)}`,
      { status: 303 }
    );
  } catch (error) {
    console.error('[AdReturn] GET error:', error);
    return NextResponse.redirect(`${origin}/`, { status: 303 });
  }
}
