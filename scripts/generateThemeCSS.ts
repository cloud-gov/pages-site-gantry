import { getUSWDSColor } from './uswds-colors';
import path from 'node:path';

export async function generateThemeCSS(
  editorAppURL: string,
  payloadAPIKey: string,
  preview: string,
): Promise<string> {
  const payloadFetch = async (baseurl: string, endpoint: string, payloadAPIKey: string) => {
    const url = path.join(baseurl || '', 'api', endpoint);
    return fetch(url, {
      headers: {
        Authorization: `users API-Key ${payloadAPIKey}`,
      },
    });
  };

  let data: {
    theme?: 'classic' | 'bold';
    primaryColor?: string;
    secondaryColor?: string;
    primaryFont?: string;
  } = {};

  try {
    const siteConfigResponse = await payloadFetch(
      editorAppURL,
      `globals/site-config?draft=${preview === 'true'}`,
      payloadAPIKey,
    );

    if (siteConfigResponse.ok) {
      data = await siteConfigResponse.json();
    }
  } catch (error) {
  }

  const themes = {
    classic: {
      colors: {
        primary: 'blue',
        secondary: 'red-vivid',
        accentCool: 'cyan',
        accentWarm: 'orange',
        base: 'gray-warm',
        text: 'base-darkest',
      },
      typography: {
        body: 'Source Sans Pro',
        heading: 'Merriweather',
        bodyWeight: 'normal',
        headingWeight: 'bold',
      },
    },
    bold: {
      colors: {
        primary: 'blue-warm',
        secondary: 'indigo-cool-vivid',
        accentCool: 'green-cool-vivid',
        accentWarm: 'gold-vivid',
        base: 'gray-warm',
        text: 'base-darkest',
      },
      typography: {
        body: 'Geist',
        heading: 'Geist',
        bodyWeight: 'normal',
        headingWeight: 700,
      },
    },
  } as const;

  const themeId = data?.theme || 'classic';
  const theme = themes[themeId] || themes.classic;
  const isBoldTheme = themeId === 'bold';

  const fontWeight = (weight?: string | number): string => {
    if (!weight) return '400';
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
    return weightMap[weight.toLowerCase()] || '400';
  };

  const primaryShade = isBoldTheme ? '80' : '60';
  const primaryDarkShade = isBoldTheme ? '90' : '70';
  const primaryDarkerShade = isBoldTheme ? '90' : '80';
  
  const primaryColor = getUSWDSColor(theme.colors.primary, primaryShade);
  const primaryDark = getUSWDSColor(theme.colors.primary, primaryDarkShade);
  const primaryDarker = getUSWDSColor(theme.colors.primary, primaryDarkerShade);
  const secondaryColor = getUSWDSColor(theme.colors.secondary, '60');
  const accentCool = getUSWDSColor(theme.colors.accentCool, '50');
  const accentWarm = getUSWDSColor(theme.colors.accentWarm, '50');
  const textColor = getUSWDSColor(theme.colors.base, '90');

  return `
:root {
  --theme-color-primary: ${primaryColor};
  --theme-color-primary-dark: ${primaryDark};
  --theme-color-primary-darker: ${primaryDarker};
  --theme-color-secondary: ${secondaryColor};
  --theme-color-accent-cool: ${accentCool};
  --theme-color-accent-warm: ${accentWarm};
  --theme-color-text: ${textColor};
  
  --theme-font-body: "${theme.typography.body}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --theme-font-heading: "${theme.typography.heading}", Georgia, "Times New Roman", serif;
  --theme-font-weight-body: ${fontWeight(theme.typography.bodyWeight)};
  --theme-font-weight-heading: ${fontWeight(theme.typography.headingWeight)};
}

.usa-button,
.usa-button:visited {
  background-color: var(--theme-color-primary) !important;
  color: white !important;
}

.usa-button:hover,
.usa-button:focus {
  background-color: var(--theme-color-primary-dark) !important;
}

.usa-button:active {
  background-color: var(--theme-color-primary-darker) !important;
}

.usa-link {
  color: var(--theme-color-primary) !important;
}

.usa-link:visited {
  color: var(--theme-color-primary-darker) !important;
}

.usa-link:hover {
  color: var(--theme-color-primary-dark) !important;
}

body,
.usa-body,
.usa-prose {
  font-family: var(--theme-font-body) !important;
  font-weight: var(--theme-font-weight-body) !important;
${isBoldTheme ? '  font-size: 1.25rem !important;' : ''}
}

h1, h2, h3, h4, h5, h6,
.usa-heading,
.usa-prose h1,
.usa-prose h2,
.usa-prose h3,
.usa-prose h4,
.usa-prose h5,
.usa-prose h6 {
  font-family: var(--theme-font-heading) !important;
  font-weight: var(--theme-font-weight-heading) !important;
}

${isBoldTheme ? `h1,
.usa-prose h1 {
  font-size: 2.5rem !important;
}

h2,
.usa-prose h2 {
  font-size: 2rem !important;
}

h3,
.usa-prose h3 {
  font-size: 1.5rem !important;
}` : ''}

body,
.usa-body,
.usa-prose {
  color: var(--theme-color-text) !important;
}
`;
}

