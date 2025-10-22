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
  preview: string,
) => {
  let data: {
    primaryColor?: string;
    secondaryColor?: string;
    primaryFont?: string;
  } = {};

  try {
    const siteConfigResponse = await payloadFetch(
      editorAppURL,
      `globals/site-config?draft=${preview === "true"}`,
      payloadAPIKey,
    );

    if (!siteConfigResponse.ok) {
      const errorText = await siteConfigResponse.text();
      console.warn(
        `Failed to fetch site config: ${siteConfigResponse.status} ${siteConfigResponse.statusText}`,
      );
      console.warn(`Response: ${errorText.substring(0, 200)}`);
      console.warn(`Using default theme values`);
    } else {
      const contentType = siteConfigResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await siteConfigResponse.text();
        console.warn(`Expected JSON but got: ${contentType}`);
        console.warn(`Response body: ${text.substring(0, 200)}`);
        console.warn(`Using default theme values`);
      } else {
        data = await siteConfigResponse.json();
      }
    }
  } catch (error) {
    console.warn(
      `Error fetching site config: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.warn(`Using default theme values`);
  }

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

      $theme-color-accent-cool-lightest: "blue-cool-5v",
      $theme-color-accent-cool-lighter: "blue-cool-5v",
      $theme-color-accent-cool-light: "blue-cool-20v",
      $theme-color-accent-cool: "cyan-30v",
      $theme-color-accent-cool-dark: "blue-cool-40v",
      $theme-color-accent-cool-darker: "blue-cool-60v",

      $theme-color-accent-warm-lightest: "orange-10",
      $theme-color-accent-warm-lighter: "orange-10",
      $theme-color-accent-warm-light: "orange-20v",
      $theme-color-accent-warm: "orange-30v",
      $theme-color-accent-warm-dark: "orange-50v",
      $theme-color-accent-warm-darker: "orange-60",
    );
  `;
};
