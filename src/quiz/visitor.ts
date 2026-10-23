// A Visitor is a random UUID in a first-party `visitor` cookie (ADR 0006).
// These read and write it straight from the headers, not with cookies() from
// next/headers, so route tests can call a handler with a plain Request.

const NAME = "visitor";
const ONE_YEAR = 60 * 60 * 24 * 365;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The Visitor's id from the Cookie header, or null. Anything that isn't a
// UUID counts as no cookie at all, so a POST mints a fresh id over it.
export function readVisitor(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const pair of header.split(";")) {
    const i = pair.indexOf("=");
    if (i === -1 || pair.slice(0, i).trim() !== NAME) continue;
    const value = pair.slice(i + 1).trim();
    return UUID.test(value) ? value.toLowerCase() : null;
  }
  return null;
}

// The Set-Cookie value. Sent on every successful POST, so the year restarts
// each time the Visitor answers. Secure in production, where the site is HTTPS.
export function visitorCookie(id: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${NAME}=${id}; Path=/; Max-Age=${ONE_YEAR}; HttpOnly; SameSite=Lax${secure}`;
}
