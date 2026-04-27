/**
 * POST /api/admin/seed-advertising-packages
 * Seed advertising packages (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const ADVERTISING_PACKAGES = [
  {
    packageId: 'advert1',
    name: 'Advert 1',
    description: 'Small landscape banner - Static display',
    monthlyPrice: 250,
    yearlyPrice: 2700,
    placement: 'homepage',
    maxUploadSize: 5242880,
    adDuration: 30,
    features: [
      'Small landscape banner (300x100px)',
      'Static display',
      '30-day campaign duration',
      'Homepage placement',
      'Click tracking enabled',
    ],
    displayOrder: 1,
  },
  {
    packageId: 'advert2',
    name: 'Advert 2',
    description: 'Portrait banner - 4-second slideshow',
    monthlyPrice: 550,
    yearlyPrice: 5940,
    placement: 'homepage',
    maxUploadSize: 5242880,
    adDuration: 30,
    features: [
      'Portrait banner (250x400px)',
      '4-second slideshow rotation',
      '30-day campaign duration',
      'Homepage placement',
      'Click tracking enabled',
      'Up to 3 images included',
    ],
    displayOrder: 2,
  },
  {
    packageId: 'advert3',
    name: 'Advert 3',
    description: 'Large landscape banner - 7-second rotation',
    monthlyPrice: 1000,
    yearlyPrice: 10800,
    placement: 'homepage',
    maxUploadSize: 10485760,
    adDuration: 30,
    features: [
      'Large landscape banner (728x300px)',
      '7-second slideshow rotation',
      '30-day campaign duration',
      'Homepage placement',
      'Click tracking enabled',
      'Up to 5 images included',
    ],
    displayOrder: 3,
  },
  {
    packageId: 'advert4',
    name: 'Advert 4',
    description: 'Premium featured placement - Top position',
    monthlyPrice: 1500,
    yearlyPrice: 16200,
    placement: 'featured',
    maxUploadSize: 10485760,
    adDuration: 30,
    features: [
      'Large landscape banner (728x300px)',
      'Top category placement',
      'Premium featured position',
      '15-second slideshow rotation',
      '30-day campaign duration',
      'Click tracking enabled',
      'Up to 8 images included',
      'Priority support',
    ],
    displayOrder: 4,
  },
  {
    packageId: 'advert5',
    name: 'Advert 5',
    description: 'Extra large landscape - Maximum visibility',
    monthlyPrice: 2000,
    yearlyPrice: 21600,
    placement: 'homepage',
    maxUploadSize: 15728640,
    adDuration: 30,
    features: [
      'Extra large landscape banner (1024x400px)',
      '15-second slideshow rotation',
      '30-day campaign duration',
      'Homepage featured section',
      'Click tracking enabled',
      'Up to 10 images included',
      'Priority support',
      'Monthly performance report',
    ],
    displayOrder: 5,
  },
  {
    packageId: 'promotions',
    name: 'Promotions',
    description: 'Promotional campaigns - Maximum exposure',
    monthlyPrice: 2500,
    yearlyPrice: 27000,
    placement: 'featured',
    maxUploadSize: 20971520,
    adDuration: 30,
    features: [
      'Multiple banner placements',
      'Premium featured section',
      'Video support (up to 30MB)',
      '20-second slideshow rotation',
      '30-day campaign duration',
      'Click tracking enabled',
      'Up to 15 images/videos',
      'Priority support',
      'Weekly performance reports',
      'Dedicated account manager',
    ],
    displayOrder: 6,
  },
  {
    packageId: 'rotating-banner',
    name: 'Rotating Banner',
    description: 'Homepage featured rotating banner with overlay text',
    monthlyPrice: 800,
    yearlyPrice: 7680,
    placement: 'homepage',
    maxUploadSize: 10485760,
    adDuration: 30,
    features: [
      'Wide landscape banner (5:1 ratio)',
      'Text overlay with CTA button',
      '5-second rotation',
      'Homepage premium section',
      'Click & impression tracking',
      'Up to 5 images',
      '⭐ Featured Business badge',
    ],
    displayOrder: 7,
  },
  {
    packageId: 'sticky',
    name: 'Sticky Ad',
    description: 'Floating corner ad visible across all pages',
    monthlyPrice: 600,
    yearlyPrice: 5760,
    placement: 'sidebar',
    maxUploadSize: 5242880,
    adDuration: 30,
    features: [
      'Square format (1:1 ratio)',
      'Fixed floating position',
      'Visible on homepage, listings & promotions',
      '10-second rotation',
      'Click & impression tracking',
      'Up to 3 images',
      'Closable by user',
    ],
    displayOrder: 8,
  },
  {
    packageId: 'inline',
    name: 'Inline Ad',
    description: 'In-content ad appearing between page sections',
    monthlyPrice: 400,
    yearlyPrice: 3840,
    placement: 'homepage',
    maxUploadSize: 5242880,
    adDuration: 30,
    features: [
      'Three display styles (default, minimal, highlight)',
      'Embedded between content sections',
      'Homepage & promotions page',
      'Click & impression tracking',
      'Up to 3 images',
      'Closable by user',
    ],
    displayOrder: 9,
  },
  {
    packageId: 'listing-banner',
    name: 'Listing Banner',
    description: 'Landscape banner on business listing detail pages',
    monthlyPrice: 700,
    yearlyPrice: 6720,
    placement: 'featured',
    maxUploadSize: 10485760,
    adDuration: 30,
    features: [
      'Wide landscape banner',
      'Business listing detail pages',
      '5-second rotation',
      'High-intent audience (actively viewing businesses)',
      'Click & impression tracking',
      'Up to 5 images',
    ],
    displayOrder: 10,
  },
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Seed packages
    const results = [];

    for (const pkg of ADVERTISING_PACKAGES) {
      try {
        const existing = await prisma.advertisementPackage.findUnique({
          where: { packageId: pkg.packageId },
        });

        if (existing) {
          // Update
          const updated = await prisma.advertisementPackage.update({
            where: { packageId: pkg.packageId },
            data: pkg,
          });
          results.push({ packageId: pkg.packageId, status: 'updated', data: updated });
        } else {
          // Create
          const created = await prisma.advertisementPackage.create({
            data: pkg,
          });
          results.push({ packageId: pkg.packageId, status: 'created', data: created });
        }
      } catch (error) {
        results.push({
          packageId: pkg.packageId,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Advertisement packages seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Error seeding packages:', error);
    return NextResponse.json(
      { error: 'Failed to seed packages' },
      { status: 500 }
    );
  }
}
