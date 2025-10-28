import type {
  PreFooterData,
  PreFooterModel,
  PreFooterBigModel,
  PreFooterSlimModel,
} from "@/env";
import {
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_NONE,
  PRE_FOOTER_TYPE_SLIM,
} from "@/env";

import { cleanPreFooterBig } from "@/utilities/preFooterBig.ts";
import { cleanPreFooterSlim } from "@/utilities/preFooterSlim";

export function cleanPreFooter(preFooter: PreFooterModel): PreFooterModel {
  let preFooterType = preFooter?.preFooterType ?? PRE_FOOTER_TYPE_NONE;
  let cleanedPreFooterData: PreFooterData;
  switch (preFooterType) {
    case PRE_FOOTER_TYPE_BIG:
      cleanedPreFooterData = cleanPreFooterBig(
        <PreFooterBigModel>preFooter?.preFooterData,
      );
      break;
    case PRE_FOOTER_TYPE_SLIM:
      cleanedPreFooterData = cleanPreFooterSlim(
        <PreFooterSlimModel>preFooter?.preFooterData,
      );
      break;
    case PRE_FOOTER_TYPE_NONE:
    default:
      cleanedPreFooterData = null;
      preFooterType = PRE_FOOTER_TYPE_NONE;
      break;
  }

  const preFooterCleaned = {
    preFooterType: preFooterType,
    preFooterData: cleanedPreFooterData,
  };

  return preFooterCleaned;
}

export async function getUsaFooterClass(preFooterType) {
  return preFooterType === "big" ? "usa-footer--big" : "usa-footer--slim";
}
