import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const escapeHTML = (str: string) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const processListBlock = ({
  node,
  htmlConverters,
}: {
  node: any;
  htmlConverters: Parameters<typeof convertLexicalToHTML>[0]["converters"];
}): string => {
  const fields = node?.fields ?? node;
  const items = Array.isArray(fields?.items) ? fields.items : [];

  const liHTML = items
    .map((it: any) => {
      const itemFields = it?.fields ?? it;
      const heading = itemFields?.heading ?? "";
      const body = itemFields?.body;

      const headingHTML = heading
        ? `<h4 class="usa-process-list__heading">${escapeHTML(heading)}</h4>`
        : "";

      const bodyHTML = body
        ? convertLexicalToHTML({ data: body, converters: htmlConverters })
        : "";

      return `<li class="usa-process-list__item">${headingHTML}${bodyHTML}</li>`;
    })
    .join("");

  return `<ol class="usa-process-list">${liHTML}</ol>`;
};
