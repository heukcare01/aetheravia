import { S3Client } from '@aws-sdk/client-s3';

// Validate environment variables
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9001';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'admin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'securepassword123';
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'aethravia';
const MINIO_REGION = process.env.MINIO_REGION || 'us-east-1';

export const s3Client = new S3Client({
  region: MINIO_REGION,
  endpoint: MINIO_ENDPOINT,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

export const BUCKET_NAME = MINIO_BUCKET_NAME;

// Utility to generate a public URL for an uploaded file
export function getPublicUrl(key: string) {
  return `${MINIO_ENDPOINT}/${MINIO_BUCKET_NAME}/${key}`;
}
