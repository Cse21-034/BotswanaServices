import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import BusinessStatusEmail from "@/emails/BusinessStatusEmail";
import { createNotification } from "@/lib/notifications";

import type { NextRequest } from 'next/server';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const id = params.id;
  const body = await req.json();

  // Get previous status for comparison
  const previousBusiness = await prisma.business.findUnique({
    where: { id },
    select: { status: true, name: true },
  });

  const allowed = ['status', 'verified', 'featured', 'name', 'description', 'categoryId', 'location', 'phone', 'email'];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const business = await prisma.business.update({
    where: { id },
    data,
    include: { owner: { select: { email: true } } },
  });

  // Send email when status changes to PUBLISHED or SUSPENDED
  const newStatus = data.status as string | undefined;
  if (newStatus && newStatus !== previousBusiness?.status && business.owner?.email) {
    try {
      if (newStatus === 'PUBLISHED') {
        await sendEmail({
          to: business.owner.email,
          subject: `🎉 ${business.name} is now live on Mzansi Services!`,
          react: BusinessStatusEmail({ businessName: business.name, status: 'PUBLISHED' }),
        });
      } else if (newStatus === 'SUSPENDED') {
        await sendEmail({
          to: business.owner.email,
          subject: `Important: ${business.name} listing has been suspended`,
          react: BusinessStatusEmail({ businessName: business.name, status: 'SUSPENDED' }),
        });
      } else if (newStatus === 'DRAFT') {
        // Treat reverting to DRAFT as rejection
        const rejectionReason = body.rejectionReason || '';
        await sendEmail({
          to: business.owner.email,
          subject: `Update on your ${business.name} listing`,
          react: BusinessStatusEmail({ businessName: business.name, status: 'REJECTED', rejectionReason }),
        });
      }
    } catch (emailError) {
      console.error('[Admin] Status email failed (non-blocking):', emailError);
    }

    // In-app notification to business owner
    try {
      const ownerRecord = await prisma.user.findFirst({ where: { businesses: { some: { id } } }, select: { id: true } });
      if (ownerRecord) {
        const notifMap: Record<string, { title: string; message: string }> = {
          PUBLISHED: { title: '🎉 Business Approved!', message: `${business.name} is now live on Mzansi Services and visible to customers.` },
          SUSPENDED: { title: '⚠️ Business Suspended', message: `${business.name} has been suspended. Please contact support.` },
          DRAFT: { title: 'Business Listing Update', message: `Your listing for ${business.name} requires attention. Check your email for details.` },
        };
        if (newStatus && notifMap[newStatus]) {
          await createNotification({ userId: ownerRecord.id, type: 'SYSTEM', ...notifMap[newStatus], data: { businessId: id } });
        }
      }
    } catch {}
  }

  // Invalidate cache
  revalidatePath('/');
  revalidatePath('/listings');
  revalidatePath('/namibiaservices');

  return NextResponse.json({ business });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const id = params.id;
  
  // Get business before deleting to get the slug
  const business = await prisma.business.findUnique({
    where: { id },
    select: { slug: true }
  });
  
  await prisma.business.delete({ where: { id } });
  
  // Invalidate cache for deleted business on multiple paths
  revalidatePath('/');
  revalidatePath('/listings');
  revalidatePath('/namibiaservices');
  if (business?.slug) {
    revalidatePath(`/listing-stay-detail/${business.slug}`);
  }
  
  return NextResponse.json({ success: true });
}
