import { FONT_STACKS, type ThemeFontOption } from "./tokens";

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const CSS_LENGTH_RE =
  /^(?:0|(?:\d*\.?\d+)(?:px|rem|em|%|vw|vh|svw|svh|lvw|lvh|dvw|dvh|ch))$/;

export function resolveHexColor(value?: string | null): string | undefined {
  const normalized = value?.trim();
  if (!normalized || !HEX_COLOR_RE.test(normalized)) return undefined;
  return normalized;
}

export function resolveFontStack(value?: string | null): string | undefined {
  const normalized = value?.trim().toLowerCase() as ThemeFontOption | undefined;
  if (!normalized) return undefined;
  return FONT_STACKS[normalized];
}

export function resolveCssLength(value?: string | null): string | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || !CSS_LENGTH_RE.test(normalized)) return undefined;
  return normalized;
}
