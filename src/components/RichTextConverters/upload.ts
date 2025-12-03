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

  const fileIcon = `
    <img src="${filePresent.src}" width="${filePresent.width}" height="${filePresent.height}" alt="download file" />
  `;

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
    <div class="usa-alert usa-alert--info usa-alert--slim usa-alert--no-icon">
    <div class="usa-alert__body">
      <h4 class="usa-alert__heading display-flex flex-row flex-align-center">
        ${fileIcon} Download File
      </h4>
      <p class="usa-alert__text">
        <a class="usa-link" href="${url}" download="true">
          ${value.altText || value.filename}
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
