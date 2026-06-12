import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, getPublicUrl } from '@/lib/s3Client';

export const runtime = 'nodejs'; // Ensure Node.js runtime for file handling

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const sanitizedName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const fileKey = `banners/${Date.now()}-${sanitizedName}`;

  try {
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
    return NextResponse.json({ error: 'MinIO upload failed', details: err }, { status: 500 });
  }
}
