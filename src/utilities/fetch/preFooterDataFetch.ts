import { payloadFetch } from "./payload-fetch";

export const preFooterCollectionName = "preFooter";
const preFooterEndpoint = "globals/pre-footer";

export async function fetchPreFooter() {
  const preFooterResponse = await payloadFetch(`${preFooterEndpoint}`);
  return await preFooterResponse?.json();
}

// export async function fetchPreFooterTest(): Promise<PreFooterModel> {
//   const data: PreFooterModel = getPreFooter();
//   return Promise.resolve(data);
// }
