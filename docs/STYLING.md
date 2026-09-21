# Styling

## Theme architecture

- `@theme` resolves to `src/styles/index.scss`
- Style primitives live in `src/styles/tokens/_primitives.scss`
- Ssemantic tokens live in `src/styles/tokens/_semantic.scss`
- Custom overrides are built by `src/utilities/theme/buildThemeCss.ts`

## Rules

- Components should consume semantic tokens like `--color-primary`
- Avoid direct `--uswds-*` usage in component styles
- Avoid hardcoded hex values in component styles
- CMS `theme.customCss` is sanitized before injection
