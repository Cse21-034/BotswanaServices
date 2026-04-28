/**
 * Subscription Access Control Utilities
 * Manages feature access based on subscription tier
 */

import { SubscriptionTier } from '@prisma/client';

export const SUBSCRIPTION_TIERS = {
  WILD_HORSES: {
    name: 'WILD HORSES',
    tier: 'WILD_HORSES' as SubscriptionTier,
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'BWP',
    yearlyDiscountPercentage: 0,
    description: 'Get listed and be found — completely free.',
    features: [
      'Basic business profile',
      'Address & map listing',
      'Business hours',
      'Logo upload',
      '1 photo',
      'Receive bookings',
      'Receive & view reviews',
      'Appears in search results',
    ],
    limits: {
      photos: 1,
      promotions: 0,
      branches: 0,
      listings: 1,
      coverImage: false,
      socialMediaLinks: false,
      servicesProfile: false,
      videoIntro: false,
      whatsappChatbot: false,
      featuredBadge: false,
      enhancedProfile: false,
      expandedGallery: false,
      dedicatedSupport: false,
      topSearchPlacement: false,
      reviewsDisplay: true,
    },
  },
  DESERT_ELEPHANTS: {
    name: 'DESERT ELEPHANTS',
    tier: 'DESERT_ELEPHANTS' as SubscriptionTier,
    monthlyPrice: 0,
    yearlyPrice: 500,
    currency: 'BWP',
    yearlyDiscountPercentage: 0,
    description: 'Build visibility and engage more customers.',
    features: [
      'Everything in Wild Horses',
      'Cover image',
      '10 photos with captions',
      'Social media links',
      '10 product/service listings',
      '3 promotions per month',
      'Services, pricing & employee info',
      '1 branch location',
      'Enhanced profile',
      'Priority support',
      'Higher search ranking',
    ],
    limits: {
      photos: 10,
      promotions: 3,
      branches: 1,
      listings: 10,
      coverImage: true,
      socialMediaLinks: true,
      servicesProfile: true,
      videoIntro: false,
      whatsappChatbot: false,
      featuredBadge: false,
      enhancedProfile: true,
      expandedGallery: true,
      dedicatedSupport: false,
      topSearchPlacement: false,
      reviewsDisplay: true,
    },
  },
  DESERT_LIONS: {
    name: 'DESERT LIONS',
    tier: 'DESERT_LIONS' as SubscriptionTier,
    monthlyPrice: 0,
    yearlyPrice: 750,
    currency: 'BWP',
    yearlyDiscountPercentage: 0,
    description: 'Maximum exposure for established businesses.',
    features: [
      'Everything in Desert Elephants',
      '50 photos',
      'Unlimited product/service listings',
      '10 promotions per month',
      '5 branch locations',
      'Video introduction',
      'Featured business badge',
      'WhatsApp chatbot integration',
      'Top search placement',
      'Full analytics dashboard',
      'Dedicated account manager',
    ],
    limits: {
      photos: 50,
      promotions: 10,
      branches: 5,
      listings: 999,
      coverImage: true,
      socialMediaLinks: true,
      servicesProfile: true,
      videoIntro: true,
      whatsappChatbot: true,
      featuredBadge: true,
      enhancedProfile: true,
      expandedGallery: true,
      dedicatedSupport: true,
      topSearchPlacement: true,
      reviewsDisplay: true,
    },
  },
};

export type SubscriptionLimits = typeof SUBSCRIPTION_TIERS.WILD_HORSES.limits;

/**
 * Get tier info by tier name
 */
export function getTierInfo(tier: SubscriptionTier | null) {
  if (!tier) {
    return SUBSCRIPTION_TIERS.WILD_HORSES;
  }

  const tierKey = tier as keyof typeof SUBSCRIPTION_TIERS;
  return SUBSCRIPTION_TIERS[tierKey] || SUBSCRIPTION_TIERS.WILD_HORSES;
}

/**
 * Get all available tiers
 */
export function getAllTiers() {
  return Object.values(SUBSCRIPTION_TIERS);
}

/**
 * Check if feature is available for tier
 */
export function hasFeature(
  tier: SubscriptionTier | null,
  feature: keyof SubscriptionLimits
): boolean {
  const tierInfo = getTierInfo(tier);
  return !!(tierInfo.limits[feature] || false);
}

/**
 * Get limit for feature
 */
export function getLimit(
  tier: SubscriptionTier | null,
  limitKey: keyof SubscriptionLimits
): any {
  const tierInfo = getTierInfo(tier);
  return tierInfo.limits[limitKey];
}

/**
 * Returns the yearly price for the tier
 */
export function getYearlyPrice(
  tier: SubscriptionTier | null
): number {
  const tierInfo = getTierInfo(tier);
  return tierInfo.yearlyPrice;
}

/**
 * Calculate the savings from yearly subscription
 */
export function getYearlySavings(
  tier: SubscriptionTier | null
): number {
  const tierInfo = getTierInfo(tier);
  if (tierInfo.monthlyPrice === 0) return 0;
  
  const yearlyPrice = tierInfo.monthlyPrice * 12;
  const discount = yearlyPrice * (tierInfo.yearlyDiscountPercentage / 100);
  return discount;
}

/**
 * Check if business can upload more photos
 */
export async function canUploadPhoto(
  businessId: string,
  currentPhotoCount: number
): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'photos');

    if (currentPhotoCount >= limit) {
      return {
        allowed: false,
        reason: `Photo limit of ${limit} reached for your ${getTierInfo(tier).name} plan`,
        limit,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking photo upload permission:', error);
    return {
      allowed: false,
      reason: 'Error checking subscription limits',
    };
  }
}

/**
 * Check if business can create more promotions
 */
export async function canCreatePromotion(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
  period?: string;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return {
        allowed: false,
        reason: 'No active subscription found',
      };
    }

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'promotions');

    // Get current month dates (1st to end of month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Count promotions created THIS MONTH ONLY
    const current = await prisma.promotion.count({
      where: {
        businessId,
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Monthly promotion limit of ${limit} reached for your ${getTierInfo(tier).name} plan. Please try again next month.`,
        limit,
        current,
        period: `${currentMonthStart.toLocaleDateString()} - ${currentMonthEnd.toLocaleDateString()}`,
      };
    }

    return { 
      allowed: true, 
      limit, 
      current,
      period: `${currentMonthStart.toLocaleDateString()} - ${currentMonthEnd.toLocaleDateString()}`,
    };
  } catch (error) {
    console.error('Error checking promotion creation permission:', error);
    return {
      allowed: false,
      reason: 'Error checking subscription limits',
    };
  }
}

/**
 * Check if business can add more branches
 */
export async function canAddBranch(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'branches');

    // Count existing branches
    const current = await prisma.business.count({
      where: {
        parentBusinessId: businessId,
        isBranch: true,
      },
    });

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Branch limit of ${limit} reached for your ${getTierInfo(tier).name} plan`,
        limit,
        current,
      };
    }

    return { allowed: true, limit, current };
  } catch (error) {
    console.error('Error checking branch creation permission:', error);
    return {
      allowed: false,
      reason: 'Error checking subscription limits',
    };
  }
}

/**
 * Check if business can create more listings
 */
export async function canAddListing(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'listings') as number;

    // 999 means unlimited
    if (limit >= 999) return { allowed: true, limit };

    const current = await prisma.listing.count({ where: { businessId } });

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Listing limit of ${limit} reached for your ${getTierInfo(tier).name} plan`,
        limit,
        current,
      };
    }

    return { allowed: true, limit, current };
  } catch (error) {
    console.error('Error checking listing creation permission:', error);
    return { allowed: false, reason: 'Error checking subscription limits' };
  }
}

/** Map payment amount to subscription tier (used to recover previous tier from payment history) */
function inferTierFromPaymentAmount(amount: number): SubscriptionTier {
  if (amount >= 915) return 'DESERT_LIONS' as SubscriptionTier;
  if (amount >= 610) return 'DESERT_ELEPHANTS' as SubscriptionTier;
  return 'WILD_HORSES' as SubscriptionTier;
}

/**
 * Get subscription status
 * Returns the EFFECTIVE tier — i.e. the last confirmed/paid plan.
 * If a new plan is pending (subscription INACTIVE with no completed payment for it),
 * we show the previously confirmed plan, not the pending one.
 */
export async function getSubscriptionStatus(businessId: string) {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!subscription) {
      return {
        tier: 'WILD_HORSES',
        status: 'INACTIVE',
        statusDisplay: 'FREE',
        plan: getTierInfo(null),
      };
    }

    const completedPayments = subscription.payments.filter(p => p.status === 'COMPLETED');
    const hasPendingPayment = subscription.payments.some(p => p.status === 'PENDING');

    // Subscription is confirmed active — no pending upgrade
    if (subscription.status === 'ACTIVE') {
      return {
        tier: subscription.plan.tier,
        status: 'ACTIVE',
        statusDisplay: 'ACTIVE',
        plan: getTierInfo(subscription.plan.tier),
        subscription,
        pendingUpgrade: false,
      };
    }

    // Subscription is INACTIVE — could be: brand new (never paid), or upgrading (has prior payments)
    if (subscription.status === 'INACTIVE') {
      if (completedPayments.length === 0) {
        // Never successfully paid — show free plan as current
        return {
          tier: 'WILD_HORSES' as SubscriptionTier,
          status: 'INACTIVE',
          statusDisplay: hasPendingPayment ? 'PENDING' : 'FREE',
          plan: getTierInfo(null),
          subscription,
          pendingUpgrade: hasPendingPayment,
          pendingPlan: hasPendingPayment ? getTierInfo(subscription.plan.tier) : null,
        };
      } else {
        // Has prior completed payments — infer the last confirmed tier from payment history
        const lastCompletedPayment = completedPayments[0]; // already sorted desc
        const previousTier = inferTierFromPaymentAmount(Number(lastCompletedPayment.amount));
        return {
          tier: previousTier,
          status: 'ACTIVE', // still active on previous plan
          statusDisplay: 'ACTIVE',
          plan: getTierInfo(previousTier),
          subscription,
          pendingUpgrade: hasPendingPayment,
          pendingPlan: hasPendingPayment ? getTierInfo(subscription.plan.tier) : null,
        };
      }
    }

    // Fallback
    return {
      tier: subscription.plan.tier,
      status: subscription.status,
      statusDisplay: subscription.status,
      plan: getTierInfo(subscription.plan.tier),
      subscription,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      tier: 'WILD_HORSES',
      status: 'INACTIVE',
      statusDisplay: 'ERROR',
      plan: getTierInfo(null),
    };
  }
}

/**
 * Format subscription display info
 */
export function formatSubscriptionDisplay(tier: SubscriptionTier | null) {
  const tierInfo = getTierInfo(tier);
  return {
    name: tierInfo.name,
    price:
      tierInfo.yearlyPrice === 0
        ? 'FREE'
        : `${tierInfo.currency} ${tierInfo.yearlyPrice.toFixed(2)}/year`,
    features: tierInfo.features,
    limits: tierInfo.limits,
  };
}

/**
 * Get monthly promotion usage stats for a business
 * Automatically tracks and provides monthly reset information
 */
export async function getMonthlyPromotionStats(businessId: string): Promise<{
  monthlyLimit: number;
  usedThisMonth: number;
  remainingThisMonth: number;
  monthStart: Date;
  monthEnd: Date;
  resetDate: string;
  tier: string;
  tier_name: string;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    const tier = subscription?.plan?.tier || null;
    const tierInfo = getTierInfo(tier);
    const monthlyLimit = getLimit(tier, 'promotions');

    // Get current month dates
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Count promotions this month
    const usedThisMonth = await prisma.promotion.count({
      where: {
        businessId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    return {
      monthlyLimit,
      usedThisMonth,
      remainingThisMonth: Math.max(0, monthlyLimit - usedThisMonth),
      monthStart,
      monthEnd,
      resetDate: nextMonthStart.toLocaleDateString(),
      tier: tier || 'WILD_HORSES',
      tier_name: tierInfo.name,
    };
  } catch (error) {
    console.error('Error getting monthly promotion stats:', error);
    throw error;
  }
}

/**
 * FEATURED HERO SPACE PRICING
 * Monetizable carousel space on homepage
 */
export const FEATURED_HERO_SPACE_PRICING = {
  MONTHLY: {
    billingCycle: 'MONTHLY' as const,
    monthlyPrice: 100,
    currency: 'BWP',
    description: 'Feature your business in the hero carousel for 1 month',
    durationDays: 30,
  },
  YEARLY: {
    billingCycle: 'YEARLY' as const,
    monthlyPrice: 1200,
    yearlyCost: 1008, // 20% discount applied: 1200 * 0.9 = 1080, but using 1008 for 16% discount
    currency: 'BWP',
    description: 'Feature your business in the hero carousel for 1 year with savings',
    durationDays: 365,
    discountPercentage: 16,
  },
};

/**
 * Get active featured hero spaces expiring in future
 * Used to display paid ads in the hero carousel
 */
export async function getActiveFeaturedHeroSpaces() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const now = new Date();

    const spaces = await prisma.featuredHeroSpace.findMany({
      where: {
        isActive: true,
        expiryDate: {
          gt: now,
        },
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            website: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return spaces;
  } catch (error) {
    console.error('Error fetching featured hero spaces:', error);
    return [];
  }
}

/**
 * Check if business can activate featured hero space
 */
export async function canActivateFeaturedHeroSpace(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  hasActiveSpace?: boolean;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const now = new Date();

    // Check if business already has active featured space
    const activeSpace = await prisma.featuredHeroSpace.findFirst({
      where: {
        businessId,
        isActive: true,
        expiryDate: {
          gt: now,
        },
      },
    });

    if (activeSpace) {
      return {
        allowed: false,
        reason: `Your business already has an active featured space until ${activeSpace.expiryDate.toLocaleDateString()}`,
        hasActiveSpace: true,
      };
    }

    return { allowed: true, hasActiveSpace: false };
  } catch (error) {
    console.error('Error checking featured hero space availability:', error);
    return {
      allowed: false,
      reason: 'Error checking featured space availability',
    };
  }
}

/**
 * Calculate featured space expiry date
 */
export function calculateFeaturedSpaceExpiryDate(billingCycle: 'MONTHLY' | 'YEARLY', startDate: Date = new Date()): Date {
  const expiryDate = new Date(startDate);
  
  if (billingCycle === 'YEARLY') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }
  
  return expiryDate;
}
