import path from "node:path";

const payloadFetch = async (
  baseurl: string,
  endpoint: string,
  payloadAPIKey,
) => {
  const url = path.join(baseurl || "", "api", endpoint);
  return fetch(url, {
    headers: {
      Authorization: `users API-Key ${payloadAPIKey}`,
    },
  });
};

const colorToken = (name: string): { family: string; mod: string } => {
  return name.endsWith("-vivid")
    ? {
        family: name.slice(0, -"-vivid".length),
        mod: "v",
      }
    : {
        family: name,
        mod: "",
      };
};

export const buildThemeStyle = async (
  editorAppURL: string,
  payloadAPIKey: string,
) => {
  const siteConfigResponse = await payloadFetch(
    editorAppURL,
    "globals/site-config?draft=true",
    payloadAPIKey,
  );
  const data: {
    primaryColor?: string;
    secondaryColor?: string;
    primaryFont?: string;
  } = await siteConfigResponse.json();

  const primaryColor = data?.primaryColor || "blue-warm-vivid";
  const pc = colorToken(primaryColor);
  const secondaryColor = data?.secondaryColor || "red-vivid";
  const sc = colorToken(secondaryColor);
  const primaryFont = data.primaryFont || "public-sans";

  return `
    @forward "uswds" with (
      $theme-utility-breakpoints: (
        "card": false,
        // 160px
        "card-lg": false,
        // 240px
        "mobile": false,
        // 320px
        "mobile-lg": true,
        // 480px
        "tablet": true,
        // 640px
        "tablet-lg": true,
        // 880px
        "desktop": true,
        // 1024px
        "desktop-lg": true,
        // 1200px
        "widescreen": true,
        // 1400px
      ),

      $theme-identifier-max-width: "desktop-lg",
      $theme-footer-max-width: "desktop-lg",
      $theme-header-max-width: "desktop-lg",
      $theme-banner-max-width: "desktop-lg",
      $theme-grid-container-max-width: "desktop-lg",
      $theme-site-margins-breakpoint: "desktop-lg",
      $theme-site-alert-max-width: "desktop-lg",
      $theme-header-logo-text-width: 70%,
      $theme-show-notifications: false,
      $theme-show-compile-warnings: false,
      $theme-font-path: '/fonts',
      $theme-image-path: '/img',

      $theme-global-link-styles: true,
      $theme-global-paragraph-styles: true,
      $theme-global-content-styles: true,

      // typography family overrides
      $theme-font-type-sans: "${primaryFont}",
      $theme-font-role-heading: "sans",
      $theme-font-role-body: "sans",
      $theme-header-font-family: "sans",
      $theme-accordion-font-family: "sans",
      $theme-navigation-font-family: "sans",
      $theme-prose-font-family: "sans",
      $theme-footer-font-family: "sans",

      // typography size overrides
      // $theme-body-font-size: "sm",
      // $theme-body-line-height: 6,
      // $theme-lead-line-height: 6,
      // $theme-text-measure: 6,
      // $theme-type-scale-3xl: 17,
      // $theme-type-scale-lg: 8,
      // $theme-type-scale-md: 6,

      $theme-link-color: "primary",
      $theme-link-visited-color: "primary-darker",
      $theme-link-hover-color: "primary-dark",
      $theme-link-active-color: "primary-vivid",
      $theme-text-color: "base-darkest",
      $theme-link-reverse-color: "white",


      $theme-card-gap: 2,
      $theme-card-margin-bottom: 2,

      // cloud brand colors -- ok to update

      $theme-color-base-family: "gray-warm",
      $theme-color-base-lightest: "gray-warm-5",
      $theme-color-base-lighter: "gray-warm-10",
      $theme-color-base-light: "gray-warm-20",
      $theme-color-base: "gray-70",
      $theme-color-base-dark: "gray-70",
      $theme-color-base-darker: "gray-80",
      $theme-color-base-darkest: "gray-90",

      $theme-color-primary-family: "${primaryColor}",
      $theme-color-primary-lightest: "${pc.family}-5${pc.mod}",
      $theme-color-primary-lighter: "${pc.family}-10${pc.mod}",
      $theme-color-primary-light: "${pc.family}-20${pc.mod}",
      $theme-color-primary: "${pc.family}-50${pc.mod}",
      $theme-color-primary-vivid: "${pc.family}-60${pc.mod}",
      $theme-color-primary-dark: "${pc.family}-70${pc.mod}",
      $theme-color-primary-darker: "${pc.family}-80${pc.mod}",
      $theme-color-primary-darkest: "${pc.family}-90",

      $theme-color-secondary-family: "${secondaryColor}",
      $theme-color-secondary-lightest: "${sc.family}-5${sc.mod}",
      $theme-color-secondary-lighter: "${sc.family}-10${sc.mod}",
      $theme-color-secondary-light: "${sc.family}-20${sc.mod}",
      $theme-color-secondary: "${sc.family}-50${sc.mod}",
      $theme-color-secondary-vivid: "${sc.family}-60${sc.mod}",
      $theme-color-secondary-dark: "${sc.family}-70${sc.mod}",
      $theme-color-secondary-darker: "${sc.family}-80${sc.mod}",
      $theme-color-secondary-darkest: "${sc.family}-90",

      $theme-color-accent-cool-lightest: "mint-cool-5v",
      $theme-color-accent-cool-lighter: "mint-cool-5v",
      $theme-color-accent-cool-light: "mint-cool-10v",
      $theme-color-accent-cool: "mint-cool-40v",
      $theme-color-accent-cool-dark: "mint-cool-60v",
      $theme-color-accent-cool-darker: "mint-cool-70v",

      $theme-color-accent-warm-lightest: "orange-warm-5v",
      $theme-color-accent-warm-lighter: "orange-warm-5v",
      $theme-color-accent-warm-light: "orange-warm-10v",
      $theme-color-accent-warm: "orange-warm-40v",
      $theme-color-accent-warm-dark: "orange-warm-50v",
      $theme-color-accent-warm-darker: "orange-warm-60v",
    );
  `;
};
