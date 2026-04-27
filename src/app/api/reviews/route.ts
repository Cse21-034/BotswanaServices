import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import NewReviewEmail from "@/emails/NewReviewEmail";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessId, rating, title, comment } = await req.json();
    const userId = session.user.id;

    if (!businessId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        businessId,
        userId,
        rating,
        title,
        comment,
      },
    });

    // Notify business owner
    try {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: { owner: { select: { email: true } } },
      });
      const reviewer = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      if (business?.owner?.email) {
        await sendEmail({
          to: business.owner.email,
          subject: `New ${rating}-star review on ${business.name}`,
          react: NewReviewEmail({
            businessName: business.name,
            reviewerName: reviewer?.name || 'A customer',
            rating,
            comment: comment || '',
            businessSlug: business.slug,
          }),
        });
      }
      // In-app notification to business owner
      if (business?.ownerId) {
        await createNotification({
          userId: business.ownerId,
          type: 'REVIEW',
          title: `New ${rating}-star review`,
          message: `${reviewer?.name || 'A customer'} left a ${rating}-star review on ${business.name}${comment ? ': "' + comment.substring(0, 80) + '"' : ''}`,
          data: { businessId, businessSlug: business.slug, rating },
        });
      }
    } catch (emailError) {
      console.error('[Review] Email/notification failed (non-blocking):', emailError);
    }

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
