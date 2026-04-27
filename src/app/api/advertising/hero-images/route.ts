/**
 * GET /api/advertising/hero-images
 * Get advertising images for hero sections by package ID
 * Query: ?packageId=advert1 or ?packageId=advert2
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
      return NextResponse.json(
        { error: 'packageId required' },
        { status: 400 }
      );
    }

    // Fetch active ad subscriptions for the specified package
    const ads = await prisma.advertisingSubscription.findMany({
      where: {
        packageId,
        status: 'ACTIVE', // Use status field, not isActive
        expiryDate: {
          gt: new Date(), // Only show non-expired ads
        },
      },
      select: {
        id: true,
        adTitle: true,
        adImageUrl: true,
        destinationUrl: true,
        packageId: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to 10 images
    });

    return NextResponse.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero images' },
      { status: 500 }
    );
  }
}
