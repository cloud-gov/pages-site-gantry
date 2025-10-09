import type { PreFooterSlimModel } from "@/env";

export function getPreFooterSlim(): PreFooterSlimModel {
  return {
    contactTelephone: "1-800-555-GOVT",
    contactEmail: "contact@agency.gov",
    footerLinks: [
      {
        text: "First link text",
        url: "#url1",
      },
      {
        text: "Second link text",
        url: "#url2",
      },
      {
        text: "Third link text",
        url: "#url3",
      },
      {
        text: "Fourth link text",
        url: "#url4",
      },
      // no more than 4 links here, trim if necessary
    ],
  };
}
