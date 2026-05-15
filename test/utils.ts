import { JSDOM } from "jsdom";

export const setupDom = (options = {}) => {
  const dom = new JSDOM(options);
  global.window = dom.window;
  global.document = dom.window.document;

  return dom;
};

export const escapeHtml = (str: string) => {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#39;");
};
