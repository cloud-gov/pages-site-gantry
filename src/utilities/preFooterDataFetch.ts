import type { PreFooterModel } from "@/env";
import { getPreFooter } from "@/components/Footer.testData";

export async function fetchPreFooter(): Promise<PreFooterModel> {
  // const response = await payloadFetch(`prefooter`);
  // const data = await response.json();

  const data: PreFooterModel = getPreFooter();

  return Promise.resolve(data);
}
