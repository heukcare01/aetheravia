// Utility for uploading images to MinIO (via S3 presigned URL) from the frontend
export async function uploadToCloudinary(file: File, folder = "banners") {
  // Sanitize filename and create a public_id
  const sanitizedName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const public_id = `${Date.now()}-${sanitizedName}`;

  // Get presigned URL from the server
  const signRes = await fetch("/api/admin/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, public_id, fileType: file.type }),
  });

  if (!signRes.ok) {
    const errorData = await signRes.json();
    throw new Error(errorData.message || errorData.error || "Failed to get MinIO presigned URL");
  }

  const { presignedUrl, secure_url } = await signRes.json();

  if (!presignedUrl) {
    throw new Error("MinIO configuration is incomplete on the server");
  }

  // Upload to MinIO directly
  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  if (!uploadRes.ok) {
    throw new Error("MinIO upload failed");
  }

  return secure_url;
}
