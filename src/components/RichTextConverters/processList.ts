import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const escapeHTML = (str: string) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

export const processListBlock = ({
  node,
  htmlConverters,
}: {
  node: any;
  htmlConverters: Parameters<typeof convertLexicalToHTML>[0]["converters"];
}): string => {
  const headingLevel = node?.fields?.headingLevel as HeadingTag;
  const fields = node?.fields ?? node;
  const items = Array.isArray(fields?.items) ? fields.items : [];

  const liHTML = items
    .map((it: any) => {
      const itemFields = it?.fields ?? it;
      const heading: string = itemFields?.heading ?? "";
      const body = itemFields?.body;

      // Skip empty items
      if (!heading && !body) return "";

      const headingHTML = heading
        ? `<${headingLevel} class="usa-process-list__heading">${escapeHTML(heading)}</${headingLevel}>`
        : "";

      const bodyHTML = body
        ? convertLexicalToHTML({ data: body, converters: htmlConverters })
        : "";

      return `<li class="usa-process-list__item">${headingHTML}${bodyHTML}</li>`;
    })
    .filter(Boolean)
    .join("");

  return `<ol class="usa-process-list">${liHTML}</ol>`;
};
