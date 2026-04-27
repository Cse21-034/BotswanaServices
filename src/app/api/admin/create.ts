import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: "ADMIN"
      }
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error("Admin create error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
