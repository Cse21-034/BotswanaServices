import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, userEmail } = body;

    if (!title || !description || !userEmail) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        businesses: true,
      },
    });

    if (!user || !user.businesses || user.businesses.length === 0) {
      return new NextResponse("User or business not found", { status: 404 });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        businessId: user.businesses[0].id,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
