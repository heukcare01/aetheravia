// Utility for uploading images to MinIO (proxied via Next.js API route)
export async function uploadImage(file: File, folder = "banners") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const uploadRes = await fetch("/api/admin/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(errorData.error || "MinIO upload failed");
  }

  const { url } = await uploadRes.json();
  return url;
}

// Keep the old name as an alias for backward compatibility during transition
export const uploadToCloudinary = uploadImage;
