import path from "node:path";

export function getDraftOption(
  renderMode: string,
  previewMode: string | boolean,
) {
  const previewModeString =
    typeof previewMode === "boolean" ? previewMode.toString() : previewMode;
  const isPreviewMode = previewModeString === "true";
  return renderMode === "static" ? "" : `&draft=${isPreviewMode}`;
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

export async function safeJsonParse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.warn(
      `API call failed for ${response.url}: ${response.status} ${response.statusText}`,
    );
    return { docs: [], totalDocs: 0 } as T;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text().catch(() => "Unknown error");
    console.warn(
      `API call returned non-JSON for ${response.url}: ${contentType}`,
    );
    return { docs: [], totalDocs: 0 } as T;
  }

  try {
    return await response.json();
  } catch (error) {
    console.warn(
      `Failed to parse JSON from ${response.url}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return { docs: [], totalDocs: 0 } as T;
  }
}
