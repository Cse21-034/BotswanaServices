import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id: params.id },
    });

    if (!promotion) {
      return new NextResponse("Promotion not found", { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, description, discount, expiryDate } = body;

    if (!title || !description || !discount || !expiryDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: params.id },
      data: {
        title,
        description,
        discount,
        expiryDate: new Date(expiryDate),
      },
    });

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.promotion.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
