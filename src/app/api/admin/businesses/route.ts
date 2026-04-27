import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { NextRequest } from 'next/server';
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Optional: support search/filter via query params
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');
  const verified = searchParams.get('verified');

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { location: { contains: search, mode: 'insensitive' as const } },
      { category: { is: { name: { contains: search, mode: 'insensitive' as const } } } }
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (verified) where.verified = verified === 'true';

  const businesses = await prisma.business.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      category: { select: { id: true, name: true } },
      reviews: true,
      favorites: true,
      bookings: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ businesses });
}
