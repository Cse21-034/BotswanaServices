import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.notification.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
