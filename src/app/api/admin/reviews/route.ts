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

  const where = {
    ...(search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { comment: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}),
      ...(status ? { status: { equals: status as any } } : {}),
  };

  const reviews = await prisma.review.findMany({
    where,
    include: {
      business: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ reviews });
}
