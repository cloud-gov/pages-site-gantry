import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import PreFooterBig from "@/components/PreFooterBig.astro";
import {
  LINK_GROUP_COLUMNS_DEFAULT,
  type PreFooterBigModel,
  CONNECT_SECTION_BOTTOM,
} from "@/env";
import { getCouncilsLinkGroups } from "@/components/PreFooterBig.testData";
import { getConnectSectionFull } from "@/components/ConnectSection.testData";

describe("PreFooterBig", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders Connect Section and LinkGroups", async () => {
    const preFooterBig: PreFooterBigModel = {
      linkGroups: getCouncilsLinkGroups(),
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: CONNECT_SECTION_BOTTOM,
        columnsInLinkGroup: LINK_GROUP_COLUMNS_DEFAULT,
      },
    };

    const result = await container.renderToString(PreFooterBig, {
      props: { preFooter: preFooterBig },
    });

    expect(result).toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer links"',
    );
    expect(result).toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer contact center and social links"',
    );
  });

  it("renders only Connect Section if no LinkGroups", async () => {
    const preFooterBig: PreFooterBigModel | any = {
      linkGroups: null,
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: CONNECT_SECTION_BOTTOM,
        columnsInLinkGroup: LINK_GROUP_COLUMNS_DEFAULT,
      },
    };

    const result = await container.renderToString(PreFooterBig, {
      props: { preFooter: preFooterBig },
    });

    expect(result).not.toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer links"',
    );
    expect(result).toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer contact center and social links"',
    );
  });

  it("renders only LinkGroups if no Connect Section", async () => {
    const preFooterBig: PreFooterBigModel | any = {
      linkGroups: getCouncilsLinkGroups(),
      connectSection: null,
      configuration: {
        connectSectionLocation: CONNECT_SECTION_BOTTOM,
        columnsInLinkGroup: LINK_GROUP_COLUMNS_DEFAULT,
      },
    };

    const result = await container.renderToString(PreFooterBig, {
      props: { preFooter: preFooterBig },
    });

    expect(result).toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer links"',
    );
    expect(result).not.toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer contact center and social lioks "',
    );
  });

  it("does not render if empty", async () => {
    async function test(preFooter: PreFooterBigModel | any) {
      const result = await container.renderToString(PreFooterBig, {
        props: { preFooter },
      });
      expect(result).toBe("");
    }

    await test(null);
    await test({});
    await test({ linkGroups: null, contactCenter: null });
    await test({ linkGroups: undefined, contactCenter: {} });
    await test({ linkGroups: [], contactCenter: {} });
  });

  it("renders Topics and Connect Section with default location", async () => {
    const preFooterBig: PreFooterBigModel | any = {
      linkGroups: getCouncilsLinkGroups(),
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: null,
        columnsInLinkGroup: LINK_GROUP_COLUMNS_DEFAULT,
      },
    };

    const result = await container.renderToString(PreFooterBig, {
      props: { preFooter: preFooterBig },
    });

    expect(result).toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer links"',
    );
    expect(result).toContain(
      '<nav class="usa-footer__nav" aria-label="Pre-footer contact center and social links"',
    );
  });
});
