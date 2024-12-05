export function getImageUrl(roomImage) {
  if (!roomImage) {
    return "/images/no-image.jpg";
  }

  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const buckerID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;

  const imageURL = [
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    "storage",
    "buckets",
    buckerID,
    "files",
    roomImage,
    "view?project=" + projectID,
  ].join("/");

  return imageURL;
}
