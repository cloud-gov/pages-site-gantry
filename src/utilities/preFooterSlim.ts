import { type LinkModel, type PreFooterSlimModel } from "@/env";

export function cleanPreFooterSlim(
  preFooter: PreFooterSlimModel,
): PreFooterSlimModel {
  const contactTelephone = clean(preFooter?.contactTelephone);
  const contactEmail = clean(preFooter?.contactEmail);
  const footerLinks = cleanLinks(preFooter?.footerLinks);

  if (contactTelephone || contactEmail || footerLinks?.length > 0) {
    return {
      contactTelephone,
      contactEmail,
      footerLinks,
    };
  }

  return null;
}

function clean(value: string): string {
  return value?.trim().length > 0 ? value?.trim() : null;
}

export function cleanLinks(links: any[]): LinkModel[] {
  return links?.map((item) => cleanLink(item))?.filter?.((item) => item);
}

export function cleanLink(link: any): LinkModel {
  let text = clean(link?.text);
  let url = clean(link?.url);

  if (text && url && link?.externalLink) {
    return {
      text,
      url,
      externalLink: link.externalLink,
    };
  }

  return null;
}
