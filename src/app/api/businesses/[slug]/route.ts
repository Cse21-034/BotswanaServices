import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSubscriptionStatus } from "@/lib/subscription-access";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const business = await prisma.business.findUnique({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
      include: {
        category: true,
        photos: {
          orderBy: { isPrimary: 'desc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        businessHours: {
          orderBy: { dayOfWeek: 'asc' }
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: "Business not found" },
        { status: 404 }
      );
    }

    // Increment view count (non-blocking)
    prisma.business.update({
      where: { id: business.id },
      data: { viewCount: { increment: 1 } }
    }).catch(() => {});

    // Compute the effective subscription tier server-side using the same
    // logic used in the dashboard — this handles ACTIVE, INACTIVE with
    // prior payments, cancelled, etc. correctly.
    const subscriptionStatus = await getSubscriptionStatus(business.id);
    const effectiveTier = subscriptionStatus.tier;

    return NextResponse.json({
      success: true,
      business,
      effectiveTier,
    });

  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: "Unable to load business" },
      { status: 500 }
    );
  }
}
