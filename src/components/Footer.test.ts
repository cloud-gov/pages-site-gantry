import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Footer from "./Footer.astro";
import {
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_NONE,
  PRE_FOOTER_TYPE_SLIM,
} from "@/env";

import { getPreFooterBig } from "@/components/PreFooterBig.testData";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData.ts";
import { getPreFooter } from "@/components/Footer.testData";

let container: any;

describe("Footer", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    container = await AstroContainer.create();
  });

  it("renders PreFooterBig", async () => {
    const result = await container.renderToString(Footer, {
      props: {
        footer: {
          preFooter: {
            preFooterType: PRE_FOOTER_TYPE_BIG,
            preFooterData: getPreFooterBig(),
          },
          footer: {
            identifier: {},
          },
        },
      },
    });

    expect(result).not.toContain("pre-footer-slim");
    expect(result).toContain('id="pre-footer-big-link-groups"');
  });

  it("renders PreFooterSlim", async () => {
    const result = await container.renderToString(Footer, {
      props: {
        footer: {
          preFooter: {
            preFooterType: PRE_FOOTER_TYPE_SLIM,
            preFooterData: getPreFooterSlim(),
          },
        },
      },
    });

    expect(result).toContain("pre-footer-slim");
    expect(result).not.toContain('id="pre-footer-big-link-groups"');
  });

  it("does not render prefooter", async () => {
    const result = await container.renderToString(Footer, {
      props: { preFooterType: PRE_FOOTER_TYPE_NONE, preFooterData: null },
    });

    expect(result).not.toContain("pre-footer-slim");
    expect(result).not.toContain('id="pre-footer-big-link-groups"');
  });

  it("renders the USWDS footer and identifier classes", async () => {
    const result = await container.renderToString(Footer);
    expect(result).toContain("usa-footer");
    expect(result).toContain("usa-identifier");
  });

  it("renders prefooter", async () => {
    let preFooter = getPreFooter();
    const result = await container.renderToString(Footer, {
      props: {
        preFooterType: preFooter.preFooterType,
        preFooterData: preFooter.preFooterData,
      },
    });

    expect(result).toContain("usa-footer");
    expect(result).toContain("usa-identifier");
  });

  it("renders the return to top link", async () => {
    const result = await container.renderToString(Footer);
    expect(result).toContain("Return to top");
  });
});
