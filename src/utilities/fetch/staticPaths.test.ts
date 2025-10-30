import { describe, expect, it, vi } from "vitest";
import { processPagesResponse, processPagesSlugResponse } from "./staticPath";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn(),
  // Add other exports if needed
}));

describe("Static Paths Fetch Utility", () => {
  it("processes pages slug response", () => {
    expect(processPagesSlugResponse(null)).toEqual([]);
    expect(processPagesSlugResponse(undefined)).toEqual([]);
    expect(processPagesSlugResponse([])).toEqual([]);
    expect(processPagesSlugResponse([null])).toEqual([]);
    expect(processPagesSlugResponse([{}])).toEqual([]);
    expect(processPagesSlugResponse([{ slug: null }])).toEqual([]);
    expect(processPagesSlugResponse([{ slug: undefined }])).toEqual([]);
  });

  it("processes pages response", () => {
    expect(processPagesResponse(null)).toEqual([]);
    expect(processPagesResponse(undefined)).toEqual([]);
    expect(processPagesResponse([])).toEqual([]);
    expect(processPagesResponse([null])).toEqual([]);
    expect(processPagesResponse([{}])).toEqual([]);
    expect(processPagesResponse([{ slug: null }])).toEqual([]);
    expect(processPagesResponse([{ slug: undefined }])).toEqual([]);
  });
});
