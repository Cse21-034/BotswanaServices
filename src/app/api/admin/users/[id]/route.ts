import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { NextRequest } from 'next/server';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const id = params.id;
  const body = await req.json();
  // Allow updating role, name, email, phone, etc.
  const allowed = ['role', 'name', 'email', 'phone', 'bio', 'location', 'website'];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const user = await prisma.user.update({
    where: { id },
    data
  });
  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const id = params.id;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
