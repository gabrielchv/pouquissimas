/**
 * `?next=` must never produce an off-site navigation.
 *
 * Run with `npm run test:redirect` (node:test; Node strips the types).
 *
 * The property under test is not "returns null for these strings" — it is
 * "anything returned stays on this origin". A separate set asserts that the
 * known attack forms are rejected outright, but the invariant test is the one
 * that would catch a new bypass nobody thought to list.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { safeRedirect } from "./safe-redirect.ts";

const BASE = "https://pouquissimas.com";
const at = (value: string) => safeRedirect(value, BASE);

/** Where a browser/router would end up given the returned path. */
const destination = (result: string) => new URL(result, BASE);

describe("safeRedirect", () => {
  it("keeps a normal internal path", () => {
    assert.equal(at("/conta"), "/conta");
  });

  it("keeps a path with a query and a fragment", () => {
    assert.equal(at("/produto/123?cor=preto#tamanho"), "/produto/123?cor=preto#tamanho");
  });

  it("rejects a protocol-relative URL", () => {
    assert.equal(at("//evil.com"), null);
  });

  it("rejects an absolute URL", () => {
    assert.equal(at("https://evil.com/x"), null);
    assert.equal(at("http://evil.com"), null);
  });

  it("rejects a backslash that WHATWG parsing reads as an authority", () => {
    // The regression. `/\evil.com` starts with a single `/`, so the old
    // prefix check accepted it; URL parsing then treats `\` as `/` and produces
    // `https://evil.com/`, which Next performs as a hard navigation.
    assert.equal(at("/\\evil.com"), null);
    assert.equal(at("/\\/evil.com"), null);
    assert.equal(at("\\\\evil.com"), null);
  });

  it("rejects a backslash that arrived percent-encoded", () => {
    // `searchParams.get("next")` decodes `?next=/%5Cevil.com` to `/\evil.com`
    // before this function sees it, so the encoded form is the same attack.
    const decoded = new URL(`${BASE}/entrar?next=/%5Cevil.com`).searchParams.get("next");
    assert.equal(decoded, "/\\evil.com");
    assert.equal(safeRedirect(decoded, BASE), null);
  });

  it("rejects a tab-smuggled slash", () => {
    // The parser strips ASCII tab and newline before parsing, so `/\t/evil.com`
    // also resolves to `https://evil.com/`.
    assert.equal(at("/\t/evil.com"), null);
    assert.equal(at("/\n/evil.com"), null);
  });

  it("rejects other schemes that would leave the site", () => {
    for (const value of ["javascript:alert(1)", "data:text/html,x", "file:///etc/passwd"]) {
      assert.equal(at(value), null, value);
    }
  });

  it("lets an empty or null value fall through to the caller's default", () => {
    assert.equal(safeRedirect(null, BASE), null);
    assert.equal(safeRedirect("", BASE), null);
  });

  it("normalises a bare relative path onto this origin", () => {
    // `\evil.com` is not a URL authority once resolved — the parser reads it as
    // an escaped path — so it lands on this site and is safe to return.
    assert.equal(at("\\evil.com"), "/evil.com");
    assert.equal(at("conta"), "/conta");
    assert.equal(destination(at("\\evil.com")!).origin, BASE);
  });

  it("never returns a value that resolves off-origin", () => {
    // The invariant, over every form seen above plus a few shapes a future
    // change might mishandle.
    const inputs = [
      "/conta",
      "/produto/1?a=b",
      "conta",
      "/\\evil.com",
      "/\\/evil.com",
      "\\evil.com",
      "\\\\evil.com",
      "/\t/evil.com",
      "//evil.com",
      "//evil.com:443/x",
      "https://evil.com",
      "http://pouquissimas.com@evil.com/",
      "javascript:alert(1)",
      "/@evil.com",
      "/%2F%2Fevil.com",
      "",
    ];

    for (const value of inputs) {
      const result = at(value);
      if (result === null) continue;
      assert.equal(
        destination(result).origin,
        BASE,
        `${JSON.stringify(value)} returned ${JSON.stringify(result)}, which resolves to ${destination(result).href}`,
      );
    }
  });
});
