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

describe("PreFooter Utilities, PreFooter", () => {
  it("cleans populated PreFooterBig", () => {
    const preFooter: PreFooterModel = {
      preFooterType: PRE_FOOTER_TYPE_BIG,
      preFooterData: getPreFooterBig(),
    };

    const preFooterCleaned = cleanPreFooter(preFooter);

    expect(preFooterCleaned.preFooterType).toEqual(PRE_FOOTER_TYPE_BIG);
    expect(preFooterCleaned.preFooterData).toEqual(
      cleanPreFooterBig(<PreFooterBigModel>preFooter.preFooterData),
    );
  });

  it("allows populated PreFooterSlim", () => {
    const preFooter: PreFooterModel = {
      preFooterType: PRE_FOOTER_TYPE_SLIM,
      preFooterData: getPreFooterSlim(),
    };

    const preFooterCleaned = cleanPreFooter(preFooter);

    expect(preFooterCleaned.preFooterType).toEqual(PRE_FOOTER_TYPE_SLIM);
    expect(preFooterCleaned.preFooterData).toEqual(preFooter.preFooterData);
  });

  it("defaults to 'none' if no pre-footer type", () => {
    const preFooter: PreFooterModel = {
      preFooterType: null,
      preFooterData: getPreFooterBig(),
    };

    const preFooterCleaned = cleanPreFooter(preFooter);

    expect(preFooterCleaned.preFooterType).toEqual(PRE_FOOTER_TYPE_NONE);
    expect(preFooterCleaned.preFooterData).toBeNull();
  });
});
