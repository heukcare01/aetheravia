import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, getPublicUrl } from '@/lib/s3Client';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB per image
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50MB per video
const MAX_IMAGES = 5;
const MAX_VIDEOS = 2;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];

export async function POST(req: NextRequest) {
  try {
    // Must be authenticated
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFiles = formData.getAll('files');       // legacy: images
    const videoFiles = formData.getAll('videos');      // new: videos

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 });
    }

    if (videoFiles.length > MAX_VIDEOS) {
      return NextResponse.json({ error: `Maximum ${MAX_VIDEOS} videos allowed` }, { status: 400 });
    }

    const uploadedImageUrls: string[] = [];
    const uploadedVideoUrls: string[] = [];

    // Upload images
    for (const file of imageFiles) {
      if (typeof file === 'string') continue;

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid image type: ${file.type}` }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      if (arrayBuffer.byteLength > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Each image must be under 5MB' }, { status: 400 });
      }

      const buffer = Buffer.from(arrayBuffer);
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const fileKey = `reviews/${Date.now()}-${sanitizedName}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
          Body: buffer,
          ContentType: file.type || 'image/jpeg',
        })
      );

      uploadedImageUrls.push(getPublicUrl(fileKey));
    }

    // Upload videos
    for (const file of videoFiles) {
      if (typeof file === 'string') continue;

      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Invalid video type: ${file.type}. Use MP4, WebM or MOV.` }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      if (arrayBuffer.byteLength > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: 'Each video must be under 50MB' }, { status: 400 });
      }

      const buffer = Buffer.from(arrayBuffer);
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const fileKey = `reviews/videos/${Date.now()}-${sanitizedName}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
          Body: buffer,
          ContentType: file.type || 'video/mp4',
        })
      );

      uploadedVideoUrls.push(getPublicUrl(fileKey));
    }

    return NextResponse.json({ urls: uploadedImageUrls, videoUrls: uploadedVideoUrls });
  } catch (err: any) {
    console.error('Review upload failed:', err);
    return NextResponse.json(
      { error: `Upload failed: ${err.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
