/**
 * Slug lookups against a literal object.
 *
 * `PAGES[slug]` is not a safe existence check for a URL segment. Every object
 * inherits from `Object.prototype`, so slugs like `constructor`, `__proto__`,
 * `toString`, `valueOf` and `hasOwnProperty` are truthy and carry no `sections`
 * field. The page's `if (!page) notFound()` therefore let them through and
 * `page.sections.map(...)` threw — a 500 for a URL that should be a 404, plus an
 * error-log entry per request from anyone probing.
 *
 * `Object.hasOwn` asks the question the code meant: is this key in the data?
 */
export function ownValue<T>(table: Record<string, T>, key: string): T | null {
  return Object.hasOwn(table, key) ? (table[key] as T) : null;
}
