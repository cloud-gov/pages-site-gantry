import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PageFindResults } from "@/env";
import {
  getFilteredResultFragment,
  search,
} from "@/utilities/filter/filtersSearch";
import * as render from "@/utilities/filter/filtersRender";

describe("Filters Search Utility, getFilteredResultFragment", () => {
  let fragment;
  let template;
  let consoleErrorSpy;

  function initParser(template) {
    const mockDoc = {
      getElementById: vi.fn(() => template),
    };

    const mockParser = {
      parseFromString: vi.fn(() => mockDoc),
    };

    (global.DOMParser as any).mockImplementation(() => mockParser);
  }

  function mockFetchResolvedValue(mockResponse: { ok: boolean; text: any }) {
    (global.fetch as any).mockResolvedValue(mockResponse);
  }

  function mockFetchRejectedValue(error) {
    (global.fetch as any).mockRejectedValue(error);
  }

  beforeEach(() => {
    fragment = { appendChild: vi.fn() };

    global.fetch = vi.fn();
    global.DOMParser = vi.fn(() => ({
      parseFromString: vi.fn(),
    })) as any;

    vi.spyOn(document, "createDocumentFragment").mockReturnValue(
      fragment as any,
    );

    const mockClonedNode = { type: "cloned-node" };
    const mockContent = {
      cloneNode: vi.fn(() => mockClonedNode),
    };
    template = Object.create(HTMLTemplateElement.prototype);
    Object.defineProperty(template, "content", {
      value: mockContent,
      writable: false,
      configurable: true,
    });

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return an empty DocumentFragment when results array is empty", async () => {
    const result = await getFilteredResultFragment([]);

    expect(result).toBe(null);
    expect(fragment.appendChild).not.toHaveBeenCalled();
  });

  it("should successfully fetch and clone templates from valid results", async () => {
    initParser(template);

    mockFetchResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("<html><body></body></html>"),
    });

    const results: PageFindResults[] = [
      {
        url: "https://example.com/page1",
        meta: { collectionItemId: "template1" },
      },
      {
        url: "https://example.com/page2",
        meta: { collectionItemId: "template2" },
      },
    ];

    await getFilteredResultFragment(results);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith("https://example.com/page1");
    expect(global.fetch).toHaveBeenCalledWith("https://example.com/page2");
    expect(fragment.appendChild).toHaveBeenCalledTimes(2);
    expect(template.content.cloneNode).toHaveBeenCalledWith(true);
  });

  it("should handle fetch failures gracefully", async () => {
    mockFetchRejectedValue(new Error("Network error"));

    const results: PageFindResults[] = [
      {
        url: "https://example.com/fail",
        meta: { collectionItemId: "template1" },
      },
    ];

    const result = await getFilteredResultFragment(results);

    expect(result).toBe(null);
    expect(fragment.appendChild).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to load template:",
      "https://example.com/fail",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should skip results when response is not ok", async () => {
    const mockResponse = {
      ok: false,
      text: vi.fn(),
    };

    mockFetchResolvedValue(mockResponse);

    const results: PageFindResults[] = [
      {
        url: "https://example.com/notfound",
        meta: { collectionItemId: "template1" },
      },
    ];

    await getFilteredResultFragment(results);

    expect(mockResponse.text).not.toHaveBeenCalled();
    expect(fragment.appendChild).not.toHaveBeenCalled();
  });

  it("should skip results when template element is not found", async () => {
    initParser(null);
    mockFetchResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("<html><body></body></html>"),
    });

    const results: PageFindResults[] = [
      {
        url: "https://example.com/page",
        meta: { collectionItemId: "missing" },
      },
    ];

    await getFilteredResultFragment(results);

    expect(fragment.appendChild).not.toHaveBeenCalled();
  });

  it("should skip results when element is not an HTMLTemplateElement", async () => {
    const mockDiv = {
      tagName: "DIV",
    };
    initParser(mockDiv);

    mockFetchResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("<html><body></body></html>"),
    });

    const results: PageFindResults[] = [
      {
        url: "https://example.com/page",
        meta: { collectionItemId: "div-element" },
      },
    ];

    await getFilteredResultFragment(results);

    expect(fragment.appendChild).not.toHaveBeenCalled();
  });

  it("should handle mixed success and failure results", async () => {
    initParser(template);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue("<html></html>"),
      })
      .mockRejectedValueOnce(new Error("Fetch failed"))
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue("<html></html>"),
      });

    const results: PageFindResults[] = [
      {
        url: "https://example.com/page1",
        meta: { collectionItemId: "template1" },
      },
      {
        url: "https://example.com/fail",
        meta: { collectionItemId: "template2" },
      },
      {
        url: "https://example.com/page3",
        meta: { collectionItemId: "template3" },
      },
    ];

    await getFilteredResultFragment(results);

    expect(fragment.appendChild).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});

describe("Filters Search Utility, search", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();

    vi.spyOn(render, "renderResults");
  });

  function createElementsPair() {
    const original = document.createElement("div");
    const filtered = document.createElement("div");

    original.style.display = "something";
    filtered.style.display = "something";

    filtered.appendChild(document.createElement("span"));

    return { original, filtered };
  }

  it("searches with filters", async () => {
    const pagefind = {
      search: vi.fn().mockResolvedValue({
        results: [
          {
            data: vi.fn().mockResolvedValue({
              title: "Old",
              meta: { sortField: "2022-01-01" },
            }),
          },
          {
            data: vi.fn().mockResolvedValue({
              title: "New",
              meta: { sortField: "2024-01-01" },
            }),
          },
        ],
      }),
    };

    const collectionList = createElementsPair();
    const pagination = createElementsPair();
    const filtersData = {} as any;

    await search(
      pagefind,
      { filters: { category: "news" } },
      collectionList,
      pagination,
      filtersData,
    );

    expect(pagefind.search).toHaveBeenCalledWith(null, {
      filters: { category: "news" },
    });

    expect(render.renderResults).toHaveBeenCalledWith(
      [
        {
          title: "New",
          meta: { sortField: "2024-01-01" },
          sortField: "2024-01-01",
        },
        {
          title: "Old",
          meta: { sortField: "2022-01-01" },
          sortField: "2022-01-01",
        },
      ],
      collectionList,
      pagination,
      filtersData,
    );
  });

  it("shows original elements and hides filtered ones", async () => {
    const pagefind = { search: vi.fn() };

    const collectionList = createElementsPair();
    const pagination = createElementsPair();
    const filtersData = {} as any;

    await search(
      pagefind,
      { filters: {} },
      collectionList,
      pagination,
      filtersData,
    );

    expect(render.renderResults).not.toHaveBeenCalled();

    expect(collectionList.original.style.display).toBe("");
    expect(collectionList.filtered.style.display).toBe("none");
    expect(collectionList.filtered.childNodes.length).toBe(0);

    expect(pagination.original.style.display).toBe("");
    expect(pagination.filtered.style.display).toBe("none");
    expect(pagination.filtered.childNodes.length).toBe(0);
  });

  it("rejects if pagefind.search throws", async () => {
    const pagefind = {
      search: vi.fn().mockRejectedValue(new Error("Search failed")),
    };

    const collectionList = createElementsPair();
    const pagination = createElementsPair();
    const filtersData = {} as any;

    await expect(
      search(
        pagefind,
        { filters: { category: "news" } },
        collectionList,
        pagination,
        filtersData,
      ),
    ).rejects.toThrow("Search failed");

    expect(render.renderResults).not.toHaveBeenCalled();
  });
});
