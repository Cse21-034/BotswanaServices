/**
 * GET /api/business/analytics?businessId=xxx
 * Returns analytics data for the business dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ message: 'Missing businessId' }, { status: 400 });
    }

    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        owner: { select: { email: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          select: { rating: true, createdAt: true, comment: true, user: { select: { name: true } } },
        },
        subscription: {
          include: {
            plan: { select: { name: true, tier: true, monthlyPrice: true } },
            payments: {
              orderBy: { createdAt: 'desc' },
              take: 12,
              select: { amount: true, status: true, createdAt: true, transactionRef: true },
            },
          },
        },
        photos: { select: { id: true } },
        listings: { select: { id: true, createdAt: true } },
        promotions: { select: { id: true, createdAt: true } },
        bookings: { select: { id: true, createdAt: true, status: true } },
      },
    });

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    if (business.owner.email !== session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: business.reviews.filter((r) => r.rating === star).length,
    }));

    // Payments by month (last 6 months)
    const now = new Date();
    const paymentsByMonth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = date.toLocaleString('en-NA', { month: 'short', year: '2-digit' });
      const monthPayments = (business.subscription?.payments || []).filter((p) => {
        const pd = new Date(p.createdAt);
        return pd.getFullYear() === date.getFullYear() && pd.getMonth() === date.getMonth() && p.status === 'COMPLETED';
      });
      const total = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      return { month: label, amount: total };
    });

    // Reviews by month (last 6 months)
    const reviewsByMonth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = date.toLocaleString('en-NA', { month: 'short', year: '2-digit' });
      const count = business.reviews.filter((r) => {
        const rd = new Date(r.createdAt);
        return rd.getFullYear() === date.getFullYear() && rd.getMonth() === date.getMonth();
      }).length;
      return { month: label, count };
    });

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalViews: business.viewCount || 0,
          totalReviews: business.reviewCount || 0,
          averageRating: business.averageRating ? Number(business.averageRating.toFixed(1)) : 0,
          totalPhotos: business.photos.length,
          totalListings: business.listings.length,
          totalPromotions: business.promotions.length,
          totalBookings: business.bookings.length,
          confirmedBookings: business.bookings.filter((b) => b.status === 'CONFIRMED').length,
        },
        subscription: {
          planName: business.subscription?.plan?.name || 'Wild Horses',
          tier: business.subscription?.plan?.tier || 'WILD_HORSES',
          monthlyPrice: business.subscription?.plan?.monthlyPrice || 0,
          status: business.subscription?.status || 'INACTIVE',
          totalPaid: (business.subscription?.payments || [])
            .filter((p) => p.status === 'COMPLETED')
            .reduce((sum, p) => sum + Number(p.amount), 0),
          paymentsCount: (business.subscription?.payments || []).filter((p) => p.status === 'COMPLETED').length,
        },
        recentReviews: business.reviews.slice(0, 5).map((r) => ({
          rating: r.rating,
          comment: r.comment,
          reviewerName: r.user?.name || 'Anonymous',
          date: r.createdAt,
        })),
        ratingDistribution,
        paymentsByMonth,
        reviewsByMonth,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
