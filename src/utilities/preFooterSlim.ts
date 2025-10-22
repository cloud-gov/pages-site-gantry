import { type LinkModel, type PreFooterSlimModel } from "@/env";

export function cleanPreFooterSlim(
  preFooter: PreFooterSlimModel,
): PreFooterSlimModel {
  const cleanedPhone = clean(preFooter?.contactTelephone);
  const cleanedEmail = clean(preFooter?.contactEmail);
  const cleanedLinks = cleanLinks(preFooter?.footerLinks);

  if (
    cleanedPhone !== null ||
    cleanedEmail !== null ||
    cleanedLinks?.length > 0
  ) {
    return {
      contactTelephone: cleanedPhone,
      contactEmail: cleanedEmail,
      footerLinks: cleanedLinks,
    };
  } else {
    return null;
  }
}

function clean(value: string): string {
  return value?.trim().length > 0 ? value?.trim() : null;
}

export function cleanLinks(links: any[]): LinkModel[] {
  const cleanedLinks: LinkModel[] = links?.map((item) => cleanLink(item));
  let result = cleanedLinks?.filter?.(
    (item) => item != null && item != undefined,
  );

  result = result?.length > 0 ? result : null;

  return result;
}

export function cleanLink(link: any): LinkModel {
  let cleanName = clean(link?.text);
  let cleanUrl = clean(link?.url);
  const externalLink = link?.externalLink ?? null;
  return cleanName !== null && cleanUrl !== null && externalLink !== null
    ? {
        text: cleanName,
        url: cleanUrl,
        externalLink: externalLink,
      }
    : null;
}
