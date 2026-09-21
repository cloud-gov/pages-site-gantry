import { describe, expect, it } from "vitest";
import {
  resolveCssLength,
  resolveFontStack,
  resolveHexColor,
} from "./resolvers";

describe("theme resolvers", () => {
  it("resolves valid hex colors", () => {
    expect(resolveHexColor("#112f4e")).toBe("#112f4e");
    expect(resolveHexColor("#FFF")).toBe("#FFF");
    expect(resolveHexColor("rgb(0,0,0)")).toBeUndefined();
  });

  it("resolves USWDS font options", () => {
    expect(resolveFontStack("public-sans")).toContain("Public Sans Web");
    expect(resolveFontStack("merriweather")).toContain("Merriweather Web");
    expect(resolveFontStack("unknown-font")).toBeUndefined();
  });

  it("resolves css lengths", () => {
    expect(resolveCssLength("75rem")).toBe("75rem");
    expect(resolveCssLength("12px")).toBe("12px");
    expect(resolveCssLength("calc(100% - 1rem)")).toBeUndefined();
  });
});
