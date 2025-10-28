import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  renderSearchResults,
  highlightKeyword,
} from "@/utilities/searchResultsClient";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn(),
  // Add other exports if needed
}));

const mockResults = {
  web: {
    results: [
      {
        title: "Example \uE000Search\uE001 Result",
        snippet: "This is a \uE000highlighted\uE001 snippet.",
        url: "https://example.com",
      },
    ],
  },
};

describe("searchResultsClient", () => {
  beforeEach(() => {
    document.body.innerHTML = ` <div id="results-count"></div> <div id="search-results"></div> `;

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResults),
        }),
      ),
    );
  });

  it("renders search results with highlighted keywords", async () => {
    await renderSearchResults({
      query: "search",
      affiliate: "test-affiliate",
      apiKey: "test-key",
    });

    const count = document.getElementById("results-count");
    const results = document.getElementById("search-results");

    expect(count?.textContent).toBe("1 results");
    expect(results?.innerHTML).toContain("<strong>Search</strong>");
    expect(results?.innerHTML).toContain("<strong>highlighted</strong>");
    expect(results?.innerHTML).toContain("https://example.com");
  });

  it("returns empty message when no results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              web: { results: [] },
            }),
        }),
      ),
    );

    await renderSearchResults({
      query: "empty",
      affiliate: "test-affiliate",
      apiKey: "test-key",
    });

    const results = document.getElementById("search-results");
    expect(results?.innerHTML).toContain("<li>No results found.</li>");
  });

  it("highlightKeyword wraps markers with <strong>", () => {
    const input = "This is \uE000important\uE001 text.";
    const output = highlightKeyword(input);
    expect(output).toBe("This is <strong>important</strong> text.");
  });
});
