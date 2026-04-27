import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { canUploadPhoto } from "@/lib/subscription-access";

// Initialize Supabase Admin directly in the route
const initSupabaseAdmin = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(url, key);
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = await initSupabaseAdmin();

    // First, get the business record for this user
    const business = await prisma.business.findFirst({
      where: { 
        ownerId: session.user.id,
        isBranch: false
      }
    });

    if (!business) {
      return NextResponse.json({ 
        error: "Business profile not found. Please create your business profile first." 
      }, { status: 404 });
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }
    
    // Check total images limit against subscription plan
    const existingPhotos = await prisma.businessPhoto.count({
      where: { businessId: business.id }
    });

    const photoCheck = await canUploadPhoto(business.id, existingPhotos + files.length - 1);
    if (!photoCheck.allowed) {
      return NextResponse.json({
        error: photoCheck.reason,
        upgradeRequired: true,
        limit: photoCheck.limit,
      }, { status: 403 });
    }

    const urls: string[] = [];
    const uploadedPhotos = [];
    
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${session.user.id}/${timestamp}-${randomString}.${fileExtension}`;

      // Convert File to Buffer for server-side upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from("business-images")
        .upload(fileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("business-images")
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      urls.push(publicUrlData.publicUrl);

      // Save to database
      const photo = await prisma.businessPhoto.create({
        data: {
          url: publicUrlData.publicUrl,
          businessId: business.id,
        }
      });

      uploadedPhotos.push(photo);
    }

    // Get updated photos list
    const photos = await prisma.businessPhoto.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ 
      success: true, 
      urls, 
      photos,
      message: `Successfully uploaded ${urls.length} image(s)`
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = await initSupabaseAdmin();

    // First, get the business record for this user
    const business = await prisma.business.findFirst({
      where: { 
        ownerId: session.user.id,
        isBranch: false
      }
    });

    if (!business) {
      return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('id');
    
    if (!imageId) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    // Get image from database
    const image = await prisma.businessPhoto.findFirst({
      where: { 
        id: imageId,
        businessId: business.id
      }
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Extract filename from URL and delete from storage
    const urlParts = image.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const fullPath = `${session.user.id}/${fileName}`;

    // Delete from Supabase Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from("business-images")
      .remove([fullPath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await prisma.businessPhoto.delete({
      where: { id: imageId }
    });

    // Get updated photos list
    const photos = await prisma.businessPhoto.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ 
      success: true, 
      photos,
      message: "Image deleted successfully" 
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, get the business record for this user
    const business = await prisma.business.findFirst({
      where: { 
        ownerId: session.user.id,
        isBranch: false
      }
    });

    if (!business) {
      return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
    }

    const photos = await prisma.businessPhoto.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Fetch images error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
