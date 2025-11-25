import type { PreFooterSlimModel } from "@/env";

export function getPreFooterSlim(): PreFooterSlimModel {
  return {
    contactTelephone: "1-800-555-GOVT",
    contactEmail: "contact@agency.gov",
    links: [
      {
        text: "First link text",
        url: "#url1",
        externalLink: true,
      },
      {
        text: "Second link text",
        url: "#url2",
        externalLink: true,
      },
      {
        text: "Third link text",
        url: "#url3",
        externalLink: true,
      },
      {
        text: "Fourth link text",
        url: "#url4",
        externalLink: true,
      },
      // no more than 4 links here, trim if necessary
    ],
  };
}
