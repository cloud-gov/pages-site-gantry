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
  query: "search highlighted",
  web: {
    total: 5,
    next_offset: 2,
    results: [
      {
        title: "Example \uE000Search\uE001 Result",
        snippet: "This is a \uE000highlighted\uE001 snippet.",
        url: "https://example.com",
      },
      {
        title: "Second search result",
        snippet: "This is another \uE000highlighted\uE001 snippet",
        url: "https://example.com/2",
      },
    ],
  },
};

describe("searchResultsClient", () => {
  beforeEach(() => {
    document.body.innerHTML = ` <div id="results-count"></div> <div id="search-results"></div> <div id="pagination"></div> `;

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
      pageValueOffset: null,
      limit: 2,
    });

    const count = document.getElementById("results-count");
    const results = document.getElementById("search-results");
    const pagination = document.getElementById("pagination");

    expect(count?.textContent).toBe('Showing 1-2 of 5 results for "search"');
    expect(count?.innerHTML).toContain("results");
    expect(results?.innerHTML).toContain("<strong>Search</strong>");
    expect(results?.innerHTML).toContain("<strong>highlighted</strong>");
    expect(results?.innerHTML).toContain("https://example.com");
    expect(pagination.innerHTML).toContain("Next");
  });

  it("returns empty message when no results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              web: { total: 0, results: [] },
            }),
        }),
      ),
    );

    await renderSearchResults({
      query: "empty",
      affiliate: "test-affiliate",
      apiKey: "test-key",
      pageValueOffset: null,
    });

    const count = document.getElementById("results-count");
    const results = document.getElementById("search-results");

    expect(results?.innerHTML).toContain("<li>No results found.</li>");
    expect(count?.innerHTML).toContain(
      'We didn\'t find any results for "<strong>empty</strong>."',
    );
  });

  it("highlightKeyword wraps markers with <strong>", () => {
    const input = "This is \uE000important\uE001 text.";
    const output = highlightKeyword(input);
    expect(output).toBe("This is <strong>important</strong> text.");
  });
});
