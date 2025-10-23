import { type Identifiers, PRE_FOOTER_TYPE_SLIM } from "@/env";
import { type PreFooterModel } from "@/env";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData";

export function getIdentifiers(): Identifiers {
  return {
    siteDomain: "Site Domain",
    identifierLinks: [
      {
        text: "About GSA",
        url: "https://www.gsa.gov/about-us",
      },
      {
        text: "Accessibility statement",
        url: "https://www.gsa.gov/website-information/accessibility-aids",
      },
      {
        text: "FOIA requests",
        url: "https://www.gsa.gov/reference/freedom-of-information-act-foia",
      },
      {
        text: "No FEAR Act data",
        url: "https://www.gsa.gov/reference/civil-rights-programs/notification-and-federal-employee-antidiscrimination-and-retaliation-act-of-2002",
      },
      {
        text: "Office of the Inspector General",
        url: "https://www.gsaig.gov/",
      },
      {
        text: "Performance reports",
        url: "https://www.gsa.gov/reference/reports/budget-performance",
      },
      {
        text: "Privacy policy",
        url: "https://www.gsa.gov/website-information/website-policies",
      },
    ],
    identifierName: "U.S. General Services Administration",
    identifierUrl: "https://gsa.gov",
  };
}

export function getPreFooter(): PreFooterModel {
  return {
    preFooterType: PRE_FOOTER_TYPE_SLIM,
    preFooterData: getPreFooterSlim(),
  };
}
