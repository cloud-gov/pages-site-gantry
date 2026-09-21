import { describe, expect, it } from "vitest";
import { sanitizeCustomCss } from "./sanitizeCustomCss";

describe("sanitizeCustomCss", () => {
  it("scopes safe selectors", () => {
    expect(sanitizeCustomCss(".foo { color: red; }")).toContain(
      "body.has-custom-css .foo { color: red; }",
    );
  });

  it("drops blocked at-rules", () => {
    expect(sanitizeCustomCss('@import url("https://example.com");')).toBe("");
  });

  it("drops unsafe urls", () => {
    expect(
      sanitizeCustomCss(
        '.foo { background-image: url("https://example.com/a.png"); color: blue; }',
      ),
    ).toContain("color: blue");
  });

  it("returns empty string on invalid css", () => {
    expect(sanitizeCustomCss(".foo { color: red; ")).toBe("");
  });
});
