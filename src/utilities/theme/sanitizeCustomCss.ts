const BLOCKED_AT_RULE_RE = /@(import|charset|namespace|document)\b/i;
const BLOCKED_VALUE_RE =
  /(expression\s*\(|javascript:|vbscript:|-moz-binding|behavior\s*:)/i;
const BLOCKED_URL_RE =
  /url\s*\(\s*(?:['"])?(?:https?:|data:|javascript:|\/\/)/i;

function scopeSelectors(selectorText: string) {
  return selectorText
    .split(",")
    .map((selector) => selector.trim())
    .filter(Boolean)
    .map((selector) => `body.has-custom-css ${selector}`)
    .join(", ");
}

function sanitizeDeclarations(block: string) {
  return block
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const colonIndex = declaration.indexOf(":");
      if (colonIndex <= 0) return "";

      const property = declaration.slice(0, colonIndex).trim();
      const value = declaration.slice(colonIndex + 1).trim();

      if (!property || !value) return "";
      if (BLOCKED_VALUE_RE.test(value) || BLOCKED_URL_RE.test(value)) return "";

      return `${property}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

export function sanitizeCustomCss(css?: string | null): string {
  const input = css?.trim();
  if (!input) return "";
  if (BLOCKED_AT_RULE_RE.test(input)) return "";

  const openCount = (input.match(/\{/g) || []).length;
  const closeCount = (input.match(/\}/g) || []).length;
  if (openCount !== closeCount) return "";

  const rules = [...input.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  if (!rules.length) return "";

  const sanitizedRules = rules
    .map((match) => {
      const selector = scopeSelectors(match[1] || "");
      const declarations = sanitizeDeclarations(match[2] || "");
      if (!selector || !declarations) return "";
      return `${selector} { ${declarations}; }`;
    })
    .filter(Boolean);

  return sanitizedRules.join("\n");
}
