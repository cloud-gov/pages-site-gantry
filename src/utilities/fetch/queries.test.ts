import { describe, expect, it } from "vitest";
import { processFetchResponse } from "./queries";

describe("Slug Data Fetch Utility", () => {
  it("processes response", () => {
    expect(processFetchResponse(null)).toEqual(null);
    expect(processFetchResponse({})).toEqual(null);
    expect(processFetchResponse({ docs: null })).toEqual(null);
    expect(processFetchResponse({ docs: [] })).toEqual(null);
    expect(processFetchResponse({ docs: [{}] })).toEqual({});
    expect(processFetchResponse({ docs: [{ id: 1 }] })).toEqual({ id: 1 });
  });
});
