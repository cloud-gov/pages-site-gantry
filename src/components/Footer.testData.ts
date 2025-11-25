import { PRE_FOOTER_TYPE_SLIM } from "@/env";
import { type PreFooterModel } from "@/env";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData";

export function getPreFooter(): PreFooterModel {
  return {
    preFooterType: PRE_FOOTER_TYPE_SLIM,
    preFooterData: getPreFooterSlim(),
  };
}
