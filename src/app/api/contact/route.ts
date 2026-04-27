import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, businessName, subject, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "First name, last name, email, and message are required" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        businessName: businessName || null,
        subject: subject || null,
        message,
      },
    });

    return NextResponse.json({ success: true, id: contact.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch contact messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
