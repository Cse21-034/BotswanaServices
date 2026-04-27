/**
 * POST /api/subscriptions/cancel
 * Cancel subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import SubscriptionCancelledEmail from '@/emails/SubscriptionCancelledEmail';
import { createNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { message: 'Missing businessId' },
        { status: 400 }
      );
    }

    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        owner: { select: { email: true } },
      },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Find and cancel subscription
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Get or create WILD_HORSES free plan
    let freePlan = await prisma.subscriptionPlan.findUnique({
      where: { slug: 'wild_horses' },
    });
    if (!freePlan) {
      freePlan = await prisma.subscriptionPlan.create({
        data: {
          name: 'WILD HORSES',
          slug: 'wild_horses',
          description: 'Get listed and be found — completely free.',
          monthlyPrice: 0,
          tier: 'WILD_HORSES',
          features: [],
          maxPhotos: 1,
          maxPromotions: 0,
          maxBranches: 0,
          features_enabled: {},
        },
      });
    }

    const cancelledPlanName = subscription.plan?.name || 'Paid Plan';

    // Cancel and downgrade to free plan
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        endDate: new Date(),
        autoRenew: false,
        planId: freePlan.id,
      },
    });

    // Send cancellation email
    try {
      if (business.owner?.email) {
        await sendEmail({
          to: business.owner.email,
          subject: `Your ${cancelledPlanName} subscription has been cancelled`,
          react: SubscriptionCancelledEmail({
            businessName: business.name,
            planName: cancelledPlanName,
          }),
        });
      }
      // In-app notification
      try {
        await createNotification({
          userId: business.ownerId,
          type: 'SYSTEM',
          title: 'Subscription Cancelled',
          message: `Your ${cancelledPlanName} subscription has been cancelled. Your account is now on the Wild Horses free plan.`,
          data: { businessId: business.id },
        });
      } catch {}
    } catch (emailError) {
      console.error('[Cancel] Email failed (non-blocking):', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
