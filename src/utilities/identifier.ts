import type { IdentifierColorFamilies, FooterColors } from "@/env";

const backgroundColorGrade = 80; // <= 80
const backgroundLightestColorGrade = 5; //
const identityDomainColorGrade = 10; // 20-30
const secondaryLinkColorGrade = 20; // 20-30;

export function getFooterColors(
  colorFamilies: IdentifierColorFamilies | null,
): FooterColors {
  if (
    !colorFamilies ||
    (!colorFamilies.identifier &&
      !colorFamilies.identityDomain &&
      !colorFamilies.primaryLink &&
      !colorFamilies.secondaryLink)
  ) {
    return null;
  }

  const identifierColorFamily = getFamily(colorFamilies?.identifier, null);

  // $theme-identifier-background-color
  // The background color of the identifier.
  // Use a color of grade 80 or higher, darker than the section that precedes it.
  let bkgColor = getColor(identifierColorFamily, backgroundColorGrade);
  let bkgColorLightest = getColor(
    identifierColorFamily,
    backgroundLightestColorGrade,
  );

  // $theme-identifier-identity-domain-color
  // The color of your domain text in the identifier masthead.
  // This should be grade 20-30 in the same family as the $theme-identifier-background-color.
  const identityDomainColorFamily = getFamily(
    colorFamilies?.identityDomain,
    identifierColorFamily,
  );
  let identityDomainColor = getColor(
    identityDomainColorFamily,
    identityDomainColorGrade,
  );

  // $theme-identifier-primary-link-color
  // The color of the links in the masthead section.
  // Default uses either the standard or
  // reverse link color set with $theme-link-color and $theme-link-reverse-color.
  let primaryLinkColor = getColor(
    getFamily(colorFamilies?.primaryLink, identityDomainColorFamily),
    identityDomainColorGrade,
  );

  // $theme-identifier-secondary-link-color
  // The color of the links in the required links section.
  // This should be grade 20-30 in a gray family.
  let secondaryLinkColor = getColor(
    getFamily(colorFamilies?.secondaryLink, null),
    secondaryLinkColorGrade,
  );

  return {
    identifier: {
      bkgColor,
      identityDomainColor,
      primaryLinkColor,
      secondaryLinkColor,
    },
    preFooter: {
      bkgColorLightest,
    },
  };
}

function getFamily(colorFamily: string, defaultColorFamily: string) {
  return colorFamily ?? defaultColorFamily;
}

function getColor(colorFamily: string, grade: number): string {
  if (!colorFamily) return "";
  const parts = colorFamily.split("-");
  const isVivid = parts.at(-1) === "vivid";

  const base = isVivid ? parts.slice(0, -1).join("-") : colorFamily;

  return isVivid ? `${base}-${grade}v` : `${base}-${grade}`;
}
