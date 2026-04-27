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
  const role = searchParams.get('role');

  const where = {
    ...(search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}),
    ...(role ? { role: { equals: role as any } } : {}),
  };

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      businesses: { select: { id: true, name: true } },
      reviews: true,
      favorites: true,
      bookings: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ users });
}
