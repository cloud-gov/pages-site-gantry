import { describe, expect, it } from "vitest";
import { getPreFooterBig } from "@/components/PreFooterBig.testData";
import { cleanPreFooterBig } from "@/utilities/preFooterBig";
import {
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_NONE,
  PRE_FOOTER_TYPE_SLIM,
  type PreFooterModel,
  type PreFooterBigModel,
} from "@/env";
import { cleanPreFooter } from "@/utilities/preFooter";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData";
import { getFooterColors } from "@/utilities/identifier.ts";

describe("Identifier Utilities", () => {
  it("gets colors", () => {
    const preFooterCleaned = getFooterColors(null);

    expect(getFooterColors(null)).toEqual(null);

    expect(
      getFooterColors({
        identifier: "gray",
        identityDomain: "gray",
        primaryLink: "gray",
        secondaryLink: "gray",
      }),
    ).toEqual({
      identifier: {
        bkgColor: "gray-80",
        identityDomainColor: "gray-10",
        primaryLinkColor: "gray-10",
        secondaryLinkColor: "gray-20",
      },
      preFooter: {
        bkgColorLightest: "gray-5",
      },
    });

    expect(
      getFooterColors({
        identifier: "gray",
        identityDomain: null,
        primaryLink: null,
        secondaryLink: null,
      }),
    ).toEqual({
      identifier: {
        bkgColor: "gray-80",
        identityDomainColor: "gray-10",
        primaryLinkColor: "gray-10",
        secondaryLinkColor: "",
      },
      preFooter: {
        bkgColorLightest: "gray-5",
      },
    });

    expect(
      getFooterColors({
        identifier: "red-vivid",
        identityDomain: "gray-cool",
        primaryLink: null,
        secondaryLink: null,
      }),
    ).toEqual({
      identifier: {
        bkgColor: "red-80v",
        identityDomainColor: "gray-cool-10",
        primaryLinkColor: "gray-cool-10",
        secondaryLinkColor: "",
      },
      preFooter: {
        bkgColorLightest: "red-5v",
      },
    });

    expect(
      getFooterColors({
        identifier: "red-vivid",
        identityDomain: "gray-cool",
        primaryLink: "blue",
        secondaryLink: null,
      }),
    ).toEqual({
      identifier: {
        bkgColor: "red-80v",
        identityDomainColor: "gray-cool-10",
        primaryLinkColor: "blue-10",
        secondaryLinkColor: "",
      },
      preFooter: {
        bkgColorLightest: "red-5v",
      },
    });

    expect(
      getFooterColors({
        identifier: "orange",
        identityDomain: null,
        primaryLink: null,
        secondaryLink: null,
      }),
    ).toEqual({
      identifier: {
        bkgColor: "orange-80",
        identityDomainColor: "orange-10",
        primaryLinkColor: "orange-10",
        secondaryLinkColor: "",
      },
      preFooter: {
        bkgColorLightest: "orange-5",
      },
    });

    expect(
      getFooterColors({
        identifier: "orange",
        identityDomain: null,
        primaryLink: null,
        secondaryLink: "gray-cool",
      }),
    ).toEqual({
      identifier: {
        bkgColor: "orange-80",
        identityDomainColor: "orange-10",
        primaryLinkColor: "orange-10",
        secondaryLinkColor: "gray-cool-20",
      },
      preFooter: {
        bkgColorLightest: "orange-5",
      },
    });
  });
});
