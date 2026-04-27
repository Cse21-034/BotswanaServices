/**
 * GET /api/advertising/status?reference=AD_xxx
 * Check actual payment and subscription status from DB.
 * Called by the success page to show the real outcome.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'reference required' }, { status: 400 });
    }

    const payment = await prisma.adPayment.findUnique({
      where: { transactionRef: reference },
      include: {
        adSubscription: {
          select: {
            id: true,
            status: true,
            packageId: true,
            adTitle: true,
            expiryDate: true,
            businessId: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Map payment status to UI status
    let uiStatus: 'success' | 'failed' | 'pending';
    if (payment.status === 'COMPLETED') {
      uiStatus = 'success';
    } else if (payment.status === 'FAILED' || payment.status === 'CANCELLED') {
      uiStatus = 'failed';
    } else {
      uiStatus = 'pending';
    }

    return NextResponse.json({
      success: true,
      status: uiStatus,
      paymentStatus: payment.status,
      subscriptionStatus: payment.adSubscription?.status,
      subscriptionId: payment.adSubscription?.id,
      packageId: payment.adSubscription?.packageId,
      adTitle: payment.adSubscription?.adTitle,
      expiryDate: payment.adSubscription?.expiryDate,
      businessId: payment.adSubscription?.businessId,
      failureReason: payment.failureReason,
    });
  } catch (error) {
    console.error('[AdStatus] Error checking payment status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
