export const getMediaUrl = ({
  url,
  filename,
  bucket,
}: {
  url: string;
  filename: string;
  bucket: string;
}) => {
  const isPreview = import.meta.env.PREVIEW_MODE === "true";
  const isLocal = import.meta.env.LOCAL_DEV === "true";
  const assetPath = `/~assets/${filename}`;

  if (isPreview) {
    return url;
  }

  if (isLocal) {
    // Use mino's local preview server from to get the media url
    const storageDomain = "http://localhost:9101";
    const storagePath = `/api/v1/buckets/${bucket}/objects/download?preview=true&prefix=`;
    return `${storageDomain}${storagePath}${assetPath}`;
  }

  return assetPath;
};
