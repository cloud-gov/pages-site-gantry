export const FONT_STACKS = {
  "public-sans":
    '"Public Sans Web", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  merriweather:
    '"Merriweather Web", Georgia, Cambria, "Times New Roman", Times, serif',
  "source-sans-pro":
    '"Source Sans Pro Web", "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

export type ThemeFontOption = keyof typeof FONT_STACKS;

export const THEME_DEFAULTS = {
  "--color-primary": "#112f4e",
  "--color-primary-on": "#ffffff",
  "--color-secondary": "#005ea2",
  "--color-secondary-on": "#ffffff",
  "--color-accent": "#8b0a03",
  "--color-text": "#1b1b1b",
  "--color-bg": "#fcfcfc",
  "--color-surface": "#f0f0f0",
  "--color-border": "#dfe1e2",
  "--color-link": "#005ea2",
  "--font-body": FONT_STACKS["public-sans"],
  "--font-heading": FONT_STACKS.merriweather,
  "--layout-max-width": "75rem",
  "--space-section-y": "3rem",
  "--radius-md": "0.25rem",
  "--focus-ring-color": "#2491ff",
  "--shadow-interactive-hover": "0 4px 8px rgba(0, 0, 0, 0.2)",
} as const;

export const THEME_VAR_ORDER = [
  "--color-primary",
  "--color-primary-on",
  "--color-secondary",
  "--color-secondary-on",
  "--color-accent",
  "--color-text",
  "--color-bg",
  "--color-surface",
  "--color-border",
  "--color-link",
  "--font-body",
  "--font-heading",
  "--layout-max-width",
  "--space-section-y",
  "--radius-md",
] as const;
