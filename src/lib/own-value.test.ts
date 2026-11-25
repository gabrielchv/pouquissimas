import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ownValue } from "./own-value.ts";

const TABLE = { privacidade: "a", termos: "b" };

describe("ownValue", () => {
  it("returns a value that is in the table", () => {
    assert.equal(ownValue(TABLE, "privacidade"), "a");
    assert.equal(ownValue(TABLE, "termos"), "b");
  });

  it("returns null for a key that is not in the table", () => {
    assert.equal(ownValue(TABLE, "nao-existe"), null);
  });

  it("does not return inherited Object members", () => {
    // These are truthy on any object literal and have no page fields, which is
    // how `/info/constructor` became a 500 instead of a 404.
    for (const key of [
      "constructor",
      "__proto__",
      "toString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
    ]) {
      assert.equal(ownValue(TABLE, key), null, key);
    }
  });

  it("the naive lookup it replaced is demonstrably wrong", () => {
    // Not testing ownValue here — recording why it exists, so the inline
    // `PAGES[slug]` cannot come back as an "obvious" simplification.
    const naive = TABLE as Record<string, unknown>;
    for (const key of ["constructor", "__proto__", "toString"]) {
      assert.ok(naive[key], `${key} is truthy on a plain object`);
      assert.equal(ownValue(TABLE, key), null, `${key} is not in the data`);
    }
  });

  it("treats an empty-string key as absent", () => {
    assert.equal(ownValue(TABLE, ""), null);
  });

  it("keeps a deliberately-null entry distinguishable from absent", () => {
    // If the table ever maps a slug to null on purpose, hasOwn still says yes.
    const withNull = { desativada: null as string | null };
    assert.equal(ownValue(withNull, "desativada"), null);
    assert.equal(Object.hasOwn(withNull, "desativada"), true);
  });
});
