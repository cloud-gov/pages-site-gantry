import { PRE_FOOTER_TYPE_SLIM } from "@/env.d";
import { type PreFooterModel } from "@/env.d";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData";

export function getPreFooter(): PreFooterModel {
  return {
    preFooterType: PRE_FOOTER_TYPE_SLIM,
    preFooterData: getPreFooterSlim(),
  };
}
