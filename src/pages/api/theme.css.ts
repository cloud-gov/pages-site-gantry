import type { APIRoute } from 'astro';
import { generateThemeCSS } from '../../../scripts/generateThemeCSS';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const editorAppURL = url.searchParams.get('editorUrl') || import.meta.env.EDITOR_APP_URL || 'http://localhost:3000';
  const payloadAPIKey = import.meta.env.PAYLOAD_API_KEY || '';
  const preview = url.searchParams.get('preview') || import.meta.env.PREVIEW_MODE || 'false';

  try {
    const css = await generateThemeCSS(editorAppURL, payloadAPIKey, preview);

    return new Response(css, {
      status: 200,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(`/* Theme generation error: ${errorMessage} */`, {
      status: 200,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
};

