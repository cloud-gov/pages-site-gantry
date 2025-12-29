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

const themes = {
  classic: {
    id: 'classic',
    label: 'Classic',
    colors: {
      base: 'gray-warm',
      primary: 'blue-warm-vivid',
      secondary: 'red-vivid',
      accentCool: 'cyan',
      accentWarm: 'orange',
      text: 'base-darkest',
    },
    typography: {
      body: 'Source Sans Pro',
      heading: 'Merriweather',
      bodyWeight: 'normal',
      headingWeight: 'bold',
      sizes: {
        xs: '3',
        sm: '4',
        base: '5',
        lg: '6',
        xl: '8',
        '2xl': '10',
        '3xl': '12',
        '4xl': '14',
      },
      headings: {
        h1: '4xl',
        h2: '3xl',
        h3: '2xl',
        h4: 'xl',
        h5: 'lg',
        h6: 'base',
      },
    },
  },
  bold: {
    id: 'bold',
    label: 'Bold',
    colors: {
      base: 'gray-warm',
      primary: 'blue-warm-vivid',
      secondary: 'indigo-cool-vivid',
      accentCool: 'green-cool-vivid',
      accentWarm: 'gold-vivid',
      text: 'base-darkest',
    },
    typography: {
      body: 'Geist',
      heading: 'Geist',
      bodyWeight: 600,
      headingWeight: 700,
      headingRole: 'sans',
      sizes: {
        xs: '3',
        sm: '4',
        base: '5',
        lg: '6',
        xl: '8',
        '2xl': '10',
        '3xl': '12',
        '4xl': '14',
      },
      headings: {
        h1: '4xl',
        h2: '3xl',
        h3: '2xl',
        h4: 'xl',
        h5: 'lg',
        h6: 'base',
      },
    },
  },
} as const;

const fontWeight = (weight?: string | number): string => {
  if (!weight) return 'normal';
  if (typeof weight === 'number') return weight.toString();
  const weightMap: Record<string, string> = {
    'thin': '100',
    'extralight': '200',
    'light': '300',
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
    'extrabold': '800',
    'black': '900',
  };
  return weightMap[weight.toLowerCase()] || weight;
};

const getHeadingRole = (headingFont: string, explicitRole?: 'serif' | 'sans'): 'serif' | 'sans' => {
  if (explicitRole) return explicitRole;
  const serifFonts = [
    'merriweather', 'georgia', 'times', 'times new roman', 'palatino', 'bookman',
    'garamond', 'baskerville', 'caslon', 'minion', 'hoefler',
  ];
  const fontLower = headingFont.toLowerCase();
  return serifFonts.some(serif => fontLower.includes(serif)) ? 'serif' : 'sans';
};

export const buildThemeStyle = async (
  editorAppURL: string,
  payloadAPIKey: string,
  preview: string,
) => {
  let data: {
    theme?: 'classic' | 'bold';
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
    } else {
      const contentType = siteConfigResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await siteConfigResponse.text();
      } else {
        data = await siteConfigResponse.json();
      }
    }
  } catch (error) {
  }

  let theme: typeof themes.classic | typeof themes.bold | {
    id: string;
    label: string;
    colors: {
      base: string;
      primary: string;
      secondary: string;
      accentCool: string;
      accentWarm: string;
      text: string;
    };
    typography: {
      body: string;
      heading: string;
      bodyWeight?: string | number;
      headingWeight?: string | number;
      headingRole?: 'serif' | 'sans';
      sizes: typeof themes.classic.typography.sizes;
      headings: typeof themes.classic.typography.headings;
    };
  } = themes.classic;
  
  if (data?.theme && themes[data.theme as keyof typeof themes]) {
    theme = themes[data.theme as keyof typeof themes];
  } else {
    const primaryColor = data?.primaryColor || "blue-warm-vivid";
    const secondaryColor = data?.secondaryColor || "red-vivid";
    const primaryFont = data?.primaryFont || "public-sans";
    
    theme = {
      id: 'custom',
      label: 'Custom',
      colors: {
        base: 'gray-warm',
        primary: primaryColor,
        secondary: secondaryColor,
        accentCool: 'cyan',
        accentWarm: 'orange',
        text: 'base-darkest',
      },
      typography: {
        body: primaryFont,
        heading: primaryFont,
        bodyWeight: 'normal',
        headingWeight: 'bold',
        sizes: themes.classic.typography.sizes,
        headings: themes.classic.typography.headings,
      },
    };
  }

  const pc = colorToken(theme.colors.primary);
  const sc = colorToken(theme.colors.secondary);
  const ac = colorToken(theme.colors.accentCool);
  const aw = colorToken(theme.colors.accentWarm);
  const base = colorToken(theme.colors.base);
  const headingRole = getHeadingRole(theme.typography.heading, (theme.typography as any).headingRole);

  return `
    @forward "uswds" with (
      $theme-utility-breakpoints: (
        "card": false,
        "card-lg": false,
        "mobile": false,
        "mobile-lg": true,
        "tablet": true,
        "tablet-lg": true,
        "desktop": true,
        "desktop-lg": true,
        "widescreen": true,
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

      $theme-font-type-sans: "${theme.typography.body}",
      $theme-font-type-serif: "${theme.typography.heading}",
      $theme-font-role-heading: "${headingRole}",
      $theme-font-role-body: "sans",
      $theme-body-font-weight: ${fontWeight(theme.typography.bodyWeight)},
      $theme-heading-font-weight: ${fontWeight(theme.typography.headingWeight)},
      $theme-header-font-family: "sans",
      $theme-accordion-font-family: "sans",
      $theme-navigation-font-family: "sans",
      $theme-prose-font-family: "sans",
      $theme-footer-font-family: "sans",

      $theme-link-color: "primary",
      $theme-link-visited-color: "primary-darker",
      $theme-link-hover-color: "primary-dark",
      $theme-link-active-color: "primary-vivid",
      $theme-text-color: "base-darkest",
      $theme-link-reverse-color: "white",

      $theme-card-gap: 2,
      $theme-card-margin-bottom: 2,

      $theme-color-base-family: "gray-warm",
      $theme-color-base-lightest: "gray-warm-5",
      $theme-color-base-lighter: "gray-warm-10",
      $theme-color-base-light: "gray-warm-20",
      $theme-color-base: "gray-70",
      $theme-color-base-dark: "gray-70",
      $theme-color-base-darker: "gray-80",
      $theme-color-base-darkest: "gray-90",

      $theme-type-scale-xs: ${theme.typography.sizes.xs},
      $theme-type-scale-sm: ${theme.typography.sizes.sm},
      $theme-type-scale-base: ${theme.typography.sizes.base},
      $theme-type-scale-lg: ${theme.typography.sizes.lg},
      $theme-type-scale-xl: ${theme.typography.sizes.xl},
      $theme-type-scale-2xl: ${theme.typography.sizes['2xl']},
      $theme-type-scale-3xl: ${theme.typography.sizes['3xl']},
      $theme-type-scale-4xl: ${theme.typography.sizes['4xl']},

      $theme-heading-h1-size: ${theme.typography.sizes[theme.typography.headings.h1 as keyof typeof theme.typography.sizes]},
      $theme-heading-h2-size: ${theme.typography.sizes[theme.typography.headings.h2 as keyof typeof theme.typography.sizes]},
      $theme-heading-h3-size: ${theme.typography.sizes[theme.typography.headings.h3 as keyof typeof theme.typography.sizes]},
      $theme-heading-h4-size: ${theme.typography.sizes[theme.typography.headings.h4 as keyof typeof theme.typography.sizes]},
      $theme-heading-h5-size: ${theme.typography.sizes[theme.typography.headings.h5 as keyof typeof theme.typography.sizes]},
      $theme-heading-h6-size: ${theme.typography.sizes[theme.typography.headings.h6 as keyof typeof theme.typography.sizes]},

      $theme-link-color: "primary",
      $theme-link-visited-color: "primary-darker",
      $theme-link-hover-color: "primary-dark",
      $theme-link-active-color: "primary-vivid",
      $theme-text-color: "base-darkest",
      $theme-link-reverse-color: "white",

      $theme-card-gap: 2,
      $theme-card-margin-bottom: 2,

      $theme-color-base-family: "${base.family}",
      $theme-color-base-lightest: "${base.family}-5",
      $theme-color-base-lighter: "${base.family}-10",
      $theme-color-base-light: "${base.family}-20",
      $theme-color-base: "gray-70",
      $theme-color-base-dark: "gray-70",
      $theme-color-base-darker: "gray-80",
      $theme-color-base-darkest: "gray-90",

      $theme-color-primary-family: "${theme.colors.primary}",
      $theme-color-primary-lightest: "${pc.family}-5${pc.mod}",
      $theme-color-primary-lighter: "${pc.family}-10${pc.mod}",
      $theme-color-primary-light: "${pc.family}-20${pc.mod}",
      $theme-color-primary: "${pc.family}-50${pc.mod}",
      $theme-color-primary-vivid: "${pc.family}-60${pc.mod}",
      $theme-color-primary-dark: "${pc.family}-70${pc.mod}",
      $theme-color-primary-darker: "${pc.family}-80${pc.mod}",
      $theme-color-primary-darkest: "${pc.family}-90",

      $theme-color-secondary-family: "${theme.colors.secondary}",
      $theme-color-secondary-lightest: "${sc.family}-5${sc.mod}",
      $theme-color-secondary-lighter: "${sc.family}-10${sc.mod}",
      $theme-color-secondary-light: "${sc.family}-20${sc.mod}",
      $theme-color-secondary: "${sc.family}-50${sc.mod}",
      $theme-color-secondary-vivid: "${sc.family}-60${sc.mod}",
      $theme-color-secondary-dark: "${sc.family}-70${sc.mod}",
      $theme-color-secondary-darker: "${sc.family}-80${sc.mod}",
      $theme-color-secondary-darkest: "${sc.family}-90",

      $theme-color-accent-cool-family: "${theme.colors.accentCool}",
      $theme-color-accent-cool-lightest: "${ac.family}-5${ac.mod}",
      $theme-color-accent-cool-lighter: "${ac.family}-10${ac.mod}",
      $theme-color-accent-cool-light: "${ac.family}-20${ac.mod}",
      $theme-color-accent-cool: "${ac.family}-30${ac.mod}",
      $theme-color-accent-cool-dark: "${ac.family}-40${ac.mod}",
      $theme-color-accent-cool-darker: "${ac.family}-60${ac.mod}",

      $theme-color-accent-warm-family: "${theme.colors.accentWarm}",
      $theme-color-accent-warm-lightest: "${aw.family}-10",
      $theme-color-accent-warm-lighter: "${aw.family}-10",
      $theme-color-accent-warm-light: "${aw.family}-20${aw.mod}",
      $theme-color-accent-warm: "${aw.family}-30${aw.mod}",
      $theme-color-accent-warm-dark: "${aw.family}-50${aw.mod}",
      $theme-color-accent-warm-darker: "${aw.family}-60",
    );
  `;
};
