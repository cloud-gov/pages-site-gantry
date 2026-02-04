import { getUploadUrl, imageMimeTypes } from "@/utilities/media";
import type { MediaValueProps } from "@/env";

export const imageBlock = ({ node }: { node: any }): string => {
  const fields = node?.fields ?? node;
  const image = fields?.image;

  if (!image || typeof image !== "object") {
    return "";
  }

  const imageValue = image as MediaValueProps;
  const altText = fields?.altText || imageValue?.altText || "";
  const width = fields?.width || "tablet";
  const customWidth = fields?.customWidth;
  const align = fields?.align || "left";

  const url = getUploadUrl({
    url: imageValue.url,
    filename: imageValue.filename,
    bucket: imageValue.site?.bucket,
  });

  const getContainerClass = () => {
    const classes: string[] = [];

    // Width class
    switch (width) {
      case "full":
        classes.push("width-full");
        break;
      case "desktop":
        classes.push("maxw-desktop");
        break;
      case "tablet":
        classes.push("maxw-tablet");
        break;
      case "mobile":
        classes.push("maxw-mobile-lg");
        break;
      case "mobile-sm":
        classes.push("maxw-mobile");
        break;
      case "custom":
        // No width class for custom, handled by style
        break;
      default:
        classes.push("maxw-tablet");
    }

    // Alignment class (only apply if not full width)
    if (width !== "full") {
      switch (align) {
        case "center":
          classes.push("margin-x-auto");
          break;
        case "right":
          classes.push("margin-left-auto");
          break;
        case "left":
        default:
          // Left is default, no class needed
          break;
      }
    }

    return classes.join(" ");
  };

  const getContainerStyle = () => {
    const styles: string[] = [];

    if (width === "custom" && customWidth) {
      styles.push(`max-width: ${customWidth}`);
    }

    return styles.length > 0 ? styles.join("; ") : "";
  };

  const containerClass = getContainerClass();
  const containerStyle = getContainerStyle();

  // Build the opening div tag with class or style
  let containerOpen: string;
  if (containerClass && !containerStyle) {
    containerOpen = `<div class="${containerClass}">`;
  } else if (containerStyle) {
    const classAttr = containerClass ? ` class="${containerClass}"` : "";
    containerOpen = `<div ${classAttr} style="${containerStyle}">`;
  } else {
    // Fallback: if no class or style, still add a div (shouldn't happen with default 'tablet')
    containerOpen = '<div class="maxw-tablet">';
  }

  if (imageMimeTypes.includes(imageValue.mimeType)) {
    return `${containerOpen}<img src="${url}" alt="${altText}" /></div>`;
  }

  return "";
};
