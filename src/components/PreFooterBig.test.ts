import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import PreFooterBig from "@/components/PreFooterBig.astro";
import {
  TOPIC_COLUMNS_DEFAULT,
  type PreFooterBigModel,
  CONNECT_SECTION_BOTTOM,
} from "@/env";
import { getCouncilsTopics } from "@/components/PreFooterBig.testData";
import { getConnectSectionFull } from "@/components/ConnectSection.testData";

describe("PreFooterBig", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders Connect Section and Topics", async () => {
    const preFooterBig: PreFooterBigModel = {
      id: 1111,
      topics: getCouncilsTopics(),
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: CONNECT_SECTION_BOTTOM,
        columnsInTopic: TOPIC_COLUMNS_DEFAULT,
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

  it("renders only Connect Section if no Topics", async () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      topics: null,
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: CONNECT_SECTION_BOTTOM,
        columnsInTopic: TOPIC_COLUMNS_DEFAULT,
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

  it("renders only Topics if no Connect Section", async () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      topics: getCouncilsTopics(),
      connectSection: null,
      configuration: {
        connectSectionLocation: CONNECT_SECTION_BOTTOM,
        columnsInTopic: TOPIC_COLUMNS_DEFAULT,
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
    // await test(undefined); // implement with mock API call
    await test({});
    await test({ topics: null, contactCenter: null });
    await test({ topics: undefined, contactCenter: {} });
    await test({ topics: [], contactCenter: {} });
  });

  it("renders Topics and Connect Section with default location", async () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      topics: getCouncilsTopics(),
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: null,
        columnsInTopic: TOPIC_COLUMNS_DEFAULT,
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
