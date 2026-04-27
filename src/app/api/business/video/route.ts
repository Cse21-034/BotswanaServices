import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST — save Cloudinary URL to the business record
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'BUSINESS') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { videoUrl, publicId } = await req.json();

    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 });
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isBranch: false },
    });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Optionally delete the old Cloudinary asset
    if (business.videoUrl && process.env.CLOUDINARY_API_KEY) {
      try {
        const oldPublicId = extractCloudinaryPublicId(business.videoUrl);
        if (oldPublicId) await deleteCloudinaryAsset(oldPublicId);
      } catch {}
    }

    await prisma.business.update({
      where: { id: business.id },
      data: { videoUrl },
    });

    return NextResponse.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Save video URL error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — remove video from Cloudinary and clear from DB
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'BUSINESS') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
    });
    if (!business || !business.videoUrl) {
      return NextResponse.json({ error: 'No video to delete' }, { status: 404 });
    }

    // Delete from Cloudinary
    if (process.env.CLOUDINARY_API_KEY) {
      try {
        const publicId = extractCloudinaryPublicId(business.videoUrl);
        if (publicId) await deleteCloudinaryAsset(publicId);
      } catch {}
    }

    await prisma.business.update({
      where: { id: business.id },
      data: { videoUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    // e.g. https://res.cloudinary.com/{cloud}/video/upload/v123/{folder}/{public_id}.mp4
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function deleteCloudinaryAsset(publicId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const crypto = await import('crypto');
  const signature = crypto
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const form = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
    resource_type: 'video',
  });

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/destroy`, {
    method: 'POST',
    body: form,
  });
}
