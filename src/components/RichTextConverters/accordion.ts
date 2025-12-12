import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const escapeHTML = (str: string) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

export const accordionBlock = ({
  node,
  htmlConverters,
}: {
  node: any;
  htmlConverters: Parameters<typeof convertLexicalToHTML>[0]["converters"];
}): string => {
  const headingLevel = node?.fields?.headingLevel as HeadingTag;
  const fields = node?.fields ?? node;
  const items = Array.isArray(fields?.items) ? fields.items : [];

  const liHTML = items // list of HTML sub components
    .map((it: any, index: number) => {
      const itemFields = it?.fields ?? it;
      const heading = itemFields?.heading ?? "";
      const accordionId = itemFields?.id ?? "";
      const content = itemFields?.content;
      const controlIndex = `a${index + 1}`;

      const headingHTML = heading
        ? `<${headingLevel} class="usa-accordion__heading">
            <button
              type="button"
              class="usa-accordion__button"
              aria-expanded=${controlIndex === "a1" ? true : false}
              aria-controls="${controlIndex}${accordionId}"
            >${escapeHTML(heading)}</button></${headingLevel}>`
        : "";

      const contentHTML = content
        ? `<div id="${controlIndex}${accordionId}" class="usa-accordion__content usa-prose">
            ${convertLexicalToHTML({ data: content, converters: htmlConverters })}
           </div>
        `
        : "";

      return `${headingHTML}${contentHTML}`;
    })
    .join("");

  return `<div class="usa-accordion usa-accordion--multiselectable" data-allow-multiple>${liHTML}</div>`;
};
