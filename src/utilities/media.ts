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
  image: MediaProperties | null
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

  const isPreview = import.meta.env.PREVIEW_MODE === "true";
  const isLocal = import.meta.env.LOCAL_DEV === "true";
  const assetPath = `/~assets/${src.filename}`;

  if (isPreview) {
    return src.url;
  }

  if (isLocal) {
    // Use mino's local preview server from to get the media url
    const storageDomain = "http://localhost:9101";
    const storagePath = `/api/v1/buckets/${src.bucket}/objects/download?preview=true&prefix=`;
    return `${storageDomain}${storagePath}${assetPath}`;
  }

  return assetPath;
};
