import type { SiteConfig } from "@/env.d";
import {
  resolveCssLength,
  resolveFontStack,
  resolveHexColor,
} from "./resolvers";
import { sanitizeCustomCss } from "./sanitizeCustomCss";
import { THEME_VAR_ORDER } from "./tokens";

export function buildThemeCss(siteConfig?: SiteConfig | null) {
  const theme = siteConfig?.theme;
  const legacyFont = resolveFontStack(siteConfig?.primaryFont);

  const entries = [
    [
      "--color-primary",
      resolveHexColor(theme?.colorPrimary) ??
        resolveHexColor(siteConfig?.primaryColor),
    ],
    ["--color-primary-on", resolveHexColor(theme?.colorPrimaryOn)],
    [
      "--color-secondary",
      resolveHexColor(theme?.colorSecondary) ??
        resolveHexColor(siteConfig?.secondaryColor),
    ],
    ["--color-secondary-on", resolveHexColor(theme?.colorSecondaryOn)],
    ["--color-accent", resolveHexColor(theme?.colorAccent)],
    ["--color-text", resolveHexColor(theme?.colorText)],
    ["--color-bg", resolveHexColor(theme?.colorBg)],
    ["--color-surface", resolveHexColor(theme?.colorSurface)],
    ["--color-border", resolveHexColor(theme?.colorBorder)],
    ["--color-link", resolveHexColor(theme?.colorLink)],
    ["--font-body", resolveFontStack(theme?.fontBody) ?? legacyFont],
    ["--font-heading", resolveFontStack(theme?.fontHeading) ?? legacyFont],
    ["--layout-max-width", resolveCssLength(theme?.layoutMaxWidth)],
    ["--space-section-y", resolveCssLength(theme?.spaceSectionY)],
    ["--radius-md", resolveCssLength(theme?.radiusMd)],
  ] as const;

  const themeLines = THEME_VAR_ORDER.map((name) => {
    const match = entries.find(([entryName]) => entryName === name);
    return match?.[1] ? `  ${name}: ${match[1]};` : "";
  }).filter(Boolean);

  return {
    themeBlock: themeLines.length
      ? `html:root {\n${themeLines.join("\n")}\n}`
      : "",
    customCss: sanitizeCustomCss(theme?.customCss),
  };
}
