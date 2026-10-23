import { MAX_REQUEST_CHARS } from "./limits";
import { visitorCookie } from "./visitor";

// Helpers for the quiz Route Handlers, which only speak HTTP (ADR 0001).

// Every quiz response depends on the visitor cookie, so no cache may keep it.
export function reply(body: unknown, status: number, visitor?: string): Response {
  const headers = new Headers({ "cache-control": "private, no-store" });
  if (visitor) headers.set("set-cookie", visitorCookie(visitor));
  return Response.json(body, { status, headers });
}

// The request body parsed as JSON, or the error response to send instead.
// The size is checked before parsing, so a huge body is never parsed.
export async function readJson(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const text = await request.text();
  if (text.length > MAX_REQUEST_CHARS) {
    return { ok: false, response: reply({ error: "Request body is too large." }, 413) };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, response: reply({ error: "Request body must be JSON." }, 400) };
  }
}
