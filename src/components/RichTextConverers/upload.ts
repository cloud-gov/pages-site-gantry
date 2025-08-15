import type { SerializedUploadNode } from "@payloadcms/richtext-lexical";
import fileDownload from "@uswds-images/usa-icons/file_download.svg";
import { getMediaUrl } from "@/utilities/media";

export interface UploadValueProps {
  id: number;
  alt: string;
  caption: string | null;
  _status: "published";
  reviewReady: boolean;
  prefix: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  site: {
    bucket: string;
  };
  sizes: {
    thumbnail: Record<string, any>;
    square: Record<string, any>;
    small: Record<string, any>;
    medium: Record<string, any>;
    large: Record<string, any>;
    xlarge: Record<string, any>;
    og: Record<string, any>;
  };
}

const imageMimeTypes = [
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

const upload = ({ node }: { node: SerializedUploadNode }): string => {
  const value = node.value as UploadValueProps;

  const url = getMediaUrl({
    url: value.url,
    filename: value.filename,
    bucket: value.site.bucket,
  });

  const icon = `
    <img src="${fileDownload.src}" width="${fileDownload.width}" height="${fileDownload.height}" alt="close" />
  `;

  const container = (slot) => `
    <div class="maxw-tablet padding-y-2 grid-row grid-gap-2">
      ${slot}
    </div>
  `;

  if (imageMimeTypes.includes(value.mimeType)) {
    const component = container(`<img src="${url}" alt="${value.alt}" />`);
    return component;
  }

  return container(
    `<a class="padding-y-2 grid-row grid-gap-2" href="${url}" download>${icon} ${value.filename}</a>`
  );
};

export default upload;
