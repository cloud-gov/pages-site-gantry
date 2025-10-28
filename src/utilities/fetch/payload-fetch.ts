import path from "node:path";

const preview = import.meta.env.PREVIEW_MODE || false;

export default async (endpoint: string) => {
  const endpointWithDraftOption = `${endpoint}&draft=${preview}`;
  const url = path.join(
    import.meta.env.EDITOR_APP_URL || "",
    "api",
    endpointWithDraftOption,
  );
  return fetch(url, {
    headers: {
      Authorization: `users API-Key ${import.meta.env.PAYLOAD_API_KEY}`,
    },
    signal: AbortSignal.timeout(5000), // 5 second timeout
  });
};
