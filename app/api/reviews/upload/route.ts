import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, getPublicUrl } from '@/lib/s3Client';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Must be authenticated
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 images allowed' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (typeof file === 'string') continue;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Validate file size (max 5MB per image)
      const arrayBuffer = await file.arrayBuffer();
      if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
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

      uploadedUrls.push(getPublicUrl(fileKey));
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (err: any) {
    console.error('Review image upload failed:', err);
    return NextResponse.json(
      { error: `Upload failed: ${err.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
