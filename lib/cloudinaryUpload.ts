// Utility for uploading images to MinIO (proxied via Next.js to avoid Mixed Content)
export async function uploadToCloudinary(file: File, folder = "banners") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const uploadRes = await fetch("/api/admin/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(errorData.error || "MinIO upload failed via proxy");
  }

  const { url } = await uploadRes.json();
  return url;
}
