interface MediaProperties {
  url: string;
  filename: string;
  site: { bucket: string };
}

interface MediaUrlProperties {
  url: string;
  filename: string;
  bucket: string;
}

export const configMediaSource = (
  image: MediaProperties | null,
): MediaUrlProperties | null => {
  if (!image?.url || !image?.filename || !image?.site?.bucket) {
    return null;
  }

  return {
    url: image.url,
    filename: image.filename,
    bucket: image.site.bucket,
  };
};

export const getMediaUrl = (image: MediaProperties): string | null => {
  const src = configMediaSource(image);

  if (!src) {
    return null;
  }

  return getUploadUrl(src);
};

export const getUploadUrl = ({
  url,
  filename,
  bucket,
}: {
  url: string;
  filename: string;
  bucket: string;
}) => {
  const baseUrl = import.meta.env.LOCAL_DEV
    ? "/"
    : (import.meta.env.BASEURL || "") + "/";

  const isPreview =
    import.meta.env.PREVIEW_MODE || import.meta.env.PREVIEW_MODE === "true";
  const isLocal = import.meta.env.LOCAL_DEV === "true";
  const assetPath = `${baseUrl}~assets/${filename}`;

  if (isPreview) {
    return `${import.meta.env.EDITOR_APP_URL}${url}`;
  }

  if (isLocal) {
    // Use mino's local preview server from to get the media url
    const storageDomain = "http://localhost:9101";
    const storagePath = `/api/v1/buckets/${bucket}/objects/download?preview=true&prefix=`;
    return `${storageDomain}${storagePath}${assetPath}`;
  }

  return assetPath;
};

export const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/tiff",
  "image/bmp",
  "image/x-icon",
  "image/heic",
  "image/heif",
  "image/heif-sequence",
  "image/heic-sequence",
];

export const formatMimeType = (type: string): string => {
  const parts = type.split("/");
  return parts[parts.length - 1].toUpperCase();
};

export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return "O Bytes";

  const units = [
    { name: "GB", divisor: 1024 * 1024 * 1024 },
    { name: "MB", divisor: 1024 * 1024 },
    { name: "KB", divisor: 1024 },
  ];

  for (const unit of units) {
    if (bytes >= unit.divisor) {
      // Round to 1 decimal places and return with unit
      return `${(bytes / unit.divisor).toFixed(1)} ${unit.name}`;
    }
  }

  // If less than 1 KB, return in bytes
  return `${bytes} Bytes`;
};
