import path from "node:path";

export function getDraftOption(renderMode: string, previewMode: string) {
  return renderMode === "static" ? "" : `&draft=${previewMode === "true"}`;
}

export async function payloadFetch(endpoint: string) {
  const draftOption = getDraftOption(
    import.meta.env.RENDER_MODE,
    import.meta.env.PREVIEW_MODE,
  );
  const url = path.join(
    import.meta.env.EDITOR_APP_URL || "",
    "api",
    `${endpoint}${draftOption}`,
  );
  return fetch(url, {
    headers: {
      Authorization: `users API-Key ${import.meta.env.PAYLOAD_API_KEY}`,
    },
    signal: AbortSignal.timeout(5000), // 5 second timeout
  });
}
