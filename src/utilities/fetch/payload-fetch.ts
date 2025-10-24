import path from "node:path";

export async function payloadFetch(endpoint: string) {
  const url = path.join(import.meta.env.EDITOR_APP_URL || "", "api", endpoint);
  return fetch(url, {
    headers: {
      Authorization: `users API-Key ${import.meta.env.PAYLOAD_API_KEY}`,
    },
  });
}

export async function payloadFetchConfigurable(
  baseurl: string,
  endpoint: string,
  payloadAPIKey,
) {
  const url = path.join(baseurl || "", "api", endpoint);
  return fetch(url, {
    headers: {
      Authorization: `users API-Key ${payloadAPIKey}`,
    },
  });
}
