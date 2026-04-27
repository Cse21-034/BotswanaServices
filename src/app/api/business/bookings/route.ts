import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'BUSINESS') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
    });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { businessId: business.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
