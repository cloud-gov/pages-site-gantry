import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const escapeHTML = (str: string) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const accordionBlock = ({
  node,
  htmlConverters,
}: {
  node: any;
  htmlConverters: Parameters<typeof convertLexicalToHTML>[0]["converters"];
}): string => {
  const fields = node?.fields ?? node;
  const items = Array.isArray(fields?.items) ? fields.items : [];

  const liHTML = items // list of HTML sub components
    .map((it: any, index: number) => {
      const itemFields = it?.fields ?? it;
      const heading = itemFields?.heading ?? "";
      const content = itemFields?.content;
      const controlIndex = `a${index + 1}`;

      const headingHTML = heading
        ? `<h4 class="usa-accordion__heading">
            <button
              type="button"
              class="usa-accordion__button"
              aria-expanded=${controlIndex === "a1" ? true : false}
              aria-controls="${controlIndex}"
            >${escapeHTML(heading)}</button></h4>`
        : "";

      const contentHTML = content
        ? `<div id="${controlIndex}" class="usa-accordion__content usa-prose">
            ${convertLexicalToHTML({ data: content, converters: htmlConverters })}
           </div>
        `
        : "";

      return `${headingHTML}${contentHTML}`;
    })
    .join("");

  return `<div class="usa-accordion usa-accordion--multiselectable" data-allow-multiple>${liHTML}</div>`;
};
