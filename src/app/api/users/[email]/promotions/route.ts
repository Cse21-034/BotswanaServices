import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: params.email },
      include: {
        businesses: {
          include: {
            promotions: true,
          },
        },
      },
    });

    if (!user || !user.businesses || user.businesses.length === 0) {
      return new NextResponse("User or business not found", { status: 404 });
    }

    // Assuming a user has only one business for now
    const business = user.businesses[0];

    return NextResponse.json(business.promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
