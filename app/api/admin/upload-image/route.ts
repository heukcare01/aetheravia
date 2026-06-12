import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, getPublicUrl } from '@/lib/s3Client';

export const runtime = 'nodejs'; // Ensure Node.js runtime for file handling

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'misc';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const sanitizedName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const fileKey = `${folder}/${Date.now()}-${sanitizedName}`;

    // Ensure bucket exists
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    } catch (bucketErr: any) {
      // Ignore if bucket already exists
      if (bucketErr.name !== 'BucketAlreadyOwnedByYou' && bucketErr.name !== 'BucketAlreadyExists') {
        console.error('Failed to create bucket:', bucketErr);
      }
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    });

    await s3Client.send(command);

    const secureUrl = getPublicUrl(fileKey);
    return NextResponse.json({ url: secureUrl });
  } catch (err) {
    console.error('Proxy upload failed:', err);
    return NextResponse.json({ error: 'MinIO proxy upload failed', details: err }, { status: 500 });
  }
}
