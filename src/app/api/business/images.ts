import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Parse form data
  const formData = await req.formData();
  const files = formData.getAll("images");
  if (files.length > 5) {
    return NextResponse.json({ error: "Max 5 images allowed" }, { status: 400 });
  }
  // TODO: Upload files to storage (e.g., local, S3, etc.) and save URLs in DB
  // For now, just return success
  return NextResponse.json({ success: true });
}
