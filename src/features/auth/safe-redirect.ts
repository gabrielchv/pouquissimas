/**
 * Same-origin redirect targets for `?next=`.
 *
 * The previous rule was a prefix check:
 *
 *     if (!value.startsWith("/") || value.startsWith("//")) return null;
 *
 * which looks sufficient and is not. WHATWG URL parsing treats `\` as `/` for
 * special schemes, so `/\evil.com` starts with a single slash, passes the check,
 * and then resolves to `https://evil.com/`. So do `/\t/evil.com` (the parser
 * strips the tab first) and `\\evil.com`. Verified against Node's `URL`:
 *
 *     new URL("/\\evil.com", "https://shop.test/entrar")  ->  https://evil.com/
 *
 * `searchParams.get` percent-decodes before this runs, so `?next=/%5Cevil.com`
 * reaches it as `/\evil.com` and is just as exploitable.
 *
 * The fix is not another character to reject — it is to stop guessing and ask the
 * URL parser the actual question: resolve the value against a base and check the
 * origin. Anything that survives that is, by construction, on this site.
 */
export function safeRedirect(value: string | null, base = "https://shop.invalid"): string | null {
  if (!value) return null;

  // A protocol-relative or absolute URL would resolve to another origin anyway;
  // rejecting them here keeps the error obvious rather than implicit.
  if (value.startsWith("//")) return null;

  let resolved: URL;
  try {
    resolved = new URL(value, base);
  } catch {
    return null;
  }

  if (resolved.origin !== new URL(base).origin) return null;

  // Return the path, not the resolved absolute URL: the caller hands this to a
  // client-side router, which expects a path.
  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}
