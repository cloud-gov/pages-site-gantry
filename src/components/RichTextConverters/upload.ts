import type { SerializedUploadNode } from "@payloadcms/richtext-lexical";
import filePresent from "@uswds-images/usa-icons/file_present.svg";
import {
  getUploadUrl,
  imageMimeTypes,
  formatMimeType,
  formatBytes,
} from "@/utilities/media";
import type { MediaValueProps as UploadValueProps } from "@/env";

const upload = ({ node }: { node: SerializedUploadNode }): string => {
  const value = node.value as UploadValueProps;

  const url = getUploadUrl({
    url: value.url,
    filename: value.filename,
    bucket: value.site.bucket,
  });

  const container = (slot) => `
    <div class="maxw-tablet">
      ${slot}
    </div>
  `;

  if (imageMimeTypes.includes(value.mimeType)) {
    const component = container(`<img src="${url}" alt="${value.altText}" />`);
    return component;
  }

  return container(`
    <div>
      <p><a class="usa-link usa-link--external" href="${url}" download="${value.filename}">${value.altText || value.filename} [${formatMimeType(value.mimeType)} - ${formatBytes(value.filesize)}]</a>
    </div>
  `);
};

export default upload;
