import type { SerializedUploadNode } from "@payloadcms/richtext-lexical";
import filePresent from "@uswds-images/usa-icons/file_present.svg";
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

const tag = (value: string) => `<span class="usa-tag">${value}</span>`;

const formatMimeType = (type: string): string => {
  const parts = type.split("/");
  return tag(parts[parts.length - 1].toLowerCase());
};

const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return tag("O Bytes");

  const units = [
    { name: "GB", divisor: 1024 * 1024 * 1024 },
    { name: "MB", divisor: 1024 * 1024 },
    { name: "KB", divisor: 1024 },
  ];

  for (const unit of units) {
    if (bytes >= unit.divisor) {
      // Round to 1 decimal places and return with unit
      return tag(`${(bytes / unit.divisor).toFixed(1)} ${unit.name}`);
    }
  }

  // If less than 1 KB, return in bytes
  return tag(`${bytes} Bytes`);
};

const upload = ({ node }: { node: SerializedUploadNode }): string => {
  const value = node.value as UploadValueProps;

  const url = getMediaUrl({
    url: value.url,
    filename: value.filename,
    bucket: value.site.bucket,
  });

  const fileIcon = `
    <img src="${filePresent.src}" width="${filePresent.width}" height="${filePresent.height}" alt="download file" />
  `;

  const container = (slot) => `
    <div class="maxw-tablet">
      ${slot}
    </div>
  `;

  if (imageMimeTypes.includes(value.mimeType)) {
    const component = container(`<img src="${url}" alt="${value.alt}" />`);
    return component;
  }

  return container(`
    <div class="usa-alert usa-alert--info usa-alert--slim usa-alert--no-icon">
    <div class="usa-alert__body">
      <h4 class="usa-alert__heading display-flex flex-row flex-align-center">
        ${fileIcon} Download File
      </h4>
      <p class="usa-alert__text">
        <a class="usa-link" href="${url}" download="true">
          ${value.alt || value.filename}
        </a>
      </p>
      <div class="usa-alert__text display-flex flex-column flex-align-end maxw-full">
        <p class="usa-alert__text">
          ${formatMimeType(value.mimeType)}
          ${formatBytes(value.filesize)}
        </p>
      </div>
    </div>
  </div>`);
};

export default upload;
