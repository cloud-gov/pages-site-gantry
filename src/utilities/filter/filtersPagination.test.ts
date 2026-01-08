import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PageNavItemModel } from "@/env";
import * as paginaton from "@/utilities/filter/filtersPagination";

describe("Filters Utility, getFilteredPageNavInfo", () => {
  it("should calculate total and current pages correctly", () => {
    function getFilteredPageNavInfoTester(resultSize, pageSize, currentPage) {
      let resultForStrings = paginaton.getFilteredPageNavInfo(
        resultSize,
        String(pageSize),
        String(currentPage),
      );
      let resultForNumbers = paginaton.getFilteredPageNavInfo(
        resultSize,
        Number(pageSize),
        Number(currentPage),
      );

      expect(resultForStrings).toEqual(resultForNumbers);
      return resultForStrings;
    }

    let result = getFilteredPageNavInfoTester(100, 10, 1);
    expect(result.filteredTotalPages).toBe(10);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(25, 10, 1);
    expect(result.filteredTotalPages).toBe(3);

    result = getFilteredPageNavInfoTester(50, 10, 10);
    expect(result.filteredTotalPages).toBe(5);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(50, 10, 0);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(50, 10, -5);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(50, 10, 3);
    expect(result.filteredCurrentPage).toBe(3);

    result = getFilteredPageNavInfoTester(50, 10, 10);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(100, 10, 5);
    expect(result.filteredTotalPages).toBe(10);
    expect(result.filteredCurrentPage).toBe(5);

    result = getFilteredPageNavInfoTester(0, 10, 1);
    expect(result.filteredTotalPages).toBe(0);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(1, 10, 1);
    expect(result.filteredTotalPages).toBe(1);
    expect(result.filteredCurrentPage).toBe(1);

    result = getFilteredPageNavInfoTester(5, 1, 3);
    expect(result.filteredTotalPages).toBe(5);
    expect(result.filteredCurrentPage).toBe(3);

    result = getFilteredPageNavInfoTester(10000, 25, 100);
    expect(result.filteredTotalPages).toBe(400);
    expect(result.filteredCurrentPage).toBe(100);
  });
});

describe("Filters Utility, getFilteredPaginationFragmentForPageNavItems", () => {
  beforeEach(() => {
    vi.spyOn(document, "getElementById").mockReturnValue(null);
    vi.spyOn(document, "createDocumentFragment").mockReturnValue({
      appendChild: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return an empty DocumentFragment when pageNavItems array is empty", () => {
    expect(paginaton.getFilteredPaginationFragmentForPageNavItems([])).toBe(
      null,
    );
  });

  it("should skip items when template element is not found", () => {
    vi.spyOn(document, "getElementById").mockReturnValue(null);
    const mockFragment = { appendChild: vi.fn() };
    vi.spyOn(document, "createDocumentFragment").mockReturnValue(
      mockFragment as any,
    );

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "page", pageNumber: "1" },
    ];

    expect(paginaton.getFilteredPaginationFragmentForPageNavItems([])).toBe(
      null,
    );
    expect(mockFragment.appendChild).not.toHaveBeenCalled();
  });

  it("should skip items when element is not an HTMLTemplateElement", () => {
    const mockDiv = Object.create(HTMLDivElement.prototype);
    vi.spyOn(document, "getElementById").mockReturnValue(mockDiv);
    const mockFragment = { appendChild: vi.fn() };
    vi.spyOn(document, "createDocumentFragment").mockReturnValue(
      mockFragment as any,
    );

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "page", pageNumber: "1" },
    ];

    expect(paginaton.getFilteredPaginationFragmentForPageNavItems([])).toBe(
      null,
    );
    expect(mockFragment.appendChild).not.toHaveBeenCalled();
  });

  it("should process valid template elements and create clones", () => {
    const mockLink = {
      href: "https://example.com/page?p=",
      textContent: "",
      text: "",
      id: "",
    };

    const mockLi = {
      cloneNode: vi.fn(function (this: any) {
        return {
          id: this.id,
          querySelector: vi.fn(() => mockLink),
        };
      }),
      querySelector: vi.fn(() => mockLink),
      id: "original-id",
    };

    const mockContent = {
      cloneNode: vi.fn(() => ({
        querySelector: vi.fn(() => mockLi),
      })),
    };

    const mockTemplate = Object.create(HTMLTemplateElement.prototype);
    Object.defineProperty(mockTemplate, "content", {
      value: mockContent,
      writable: false,
      configurable: true,
    });

    vi.spyOn(document, "getElementById").mockReturnValue(mockTemplate);
    const mockFragment = { appendChild: vi.fn() };
    vi.spyOn(document, "createDocumentFragment").mockReturnValue(
      mockFragment as any,
    );

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "page", pageNumber: "5" },
    ];

    paginaton.getFilteredPaginationFragmentForPageNavItems(pageNavItems);

    expect(mockContent.cloneNode).toHaveBeenCalledWith(true);
    expect(mockLi.cloneNode).toHaveBeenCalledWith(true);
    expect(mockFragment.appendChild).toHaveBeenCalledTimes(1);
  });

  it("should set link text and href for page itemType", () => {
    const mockLink = {
      href: "https://example.com/page?p=",
      textContent: "",
      text: "",
      id: "",
    };

    const mockLi = {
      cloneNode: vi.fn(function (this: any) {
        return {
          id: "",
          querySelector: vi.fn(() => mockLink),
        };
      }),
      querySelector: vi.fn(() => mockLink),
      id: "test-id",
    };

    const mockContent = {
      cloneNode: vi.fn(() => ({
        querySelector: vi.fn(() => mockLi),
      })),
    };

    const mockTemplate = Object.create(HTMLTemplateElement.prototype);
    Object.defineProperty(mockTemplate, "content", {
      value: mockContent,
      writable: false,
      configurable: true,
    });

    vi.spyOn(document, "getElementById").mockReturnValue(mockTemplate);
    vi.spyOn(document, "createDocumentFragment").mockReturnValue({
      appendChild: vi.fn(),
    } as any);

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "page", pageNumber: "3" },
    ];

    paginaton.getFilteredPaginationFragmentForPageNavItems(pageNavItems);

    expect(mockLink.textContent).toBe("3");
    expect(mockLink.text).toBe("3");
    expect(mockLink.href).toBe("https://example.com/page?p=3");
  });

  it("should not set link text for non-page itemType", () => {
    const mockLink = {
      href: "https://example.com/page?p=",
      textContent: "Next",
      text: "Next",
      id: "",
    };

    const mockLi = {
      cloneNode: vi.fn(function (this: any) {
        return {
          id: "",
          querySelector: vi.fn(() => mockLink),
        };
      }),
      querySelector: vi.fn(() => mockLink),
      id: "test-id",
    };

    const mockContent = {
      cloneNode: vi.fn(() => ({
        querySelector: vi.fn(() => mockLi),
      })),
    };

    const mockTemplate = Object.create(HTMLTemplateElement.prototype);
    Object.defineProperty(mockTemplate, "content", {
      value: mockContent,
      writable: false,
      configurable: true,
    });

    vi.spyOn(document, "getElementById").mockReturnValue(mockTemplate);
    vi.spyOn(document, "createDocumentFragment").mockReturnValue({
      appendChild: vi.fn(),
    } as any);

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "next", pageNumber: "4" },
    ];

    paginaton.getFilteredPaginationFragmentForPageNavItems(pageNavItems);

    expect(mockLink.textContent).toBe("Next");
    expect(mockLink.href).toBe("https://example.com/page?p=4");
  });

  it("should handle multiple page nav items", () => {
    const createMockStructure = () => {
      const mockLink = {
        href: "https://example.com/page?p=",
        textContent: "",
        text: "",
        id: "",
      };

      const mockLi = {
        cloneNode: vi.fn(function (this: any) {
          return {
            id: "",
            querySelector: vi.fn(() => ({ ...mockLink })),
          };
        }),
        querySelector: vi.fn(() => mockLink),
        id: "test-id",
      };

      const mockContent = {
        cloneNode: vi.fn(() => ({
          querySelector: vi.fn(() => mockLi),
        })),
      };

      const mockTemplate = Object.create(HTMLTemplateElement.prototype);
      Object.defineProperty(mockTemplate, "content", {
        value: mockContent,
        writable: false,
        configurable: true,
      });

      return mockTemplate;
    };

    vi.spyOn(document, "getElementById").mockImplementation(() =>
      createMockStructure(),
    );
    const mockFragment = { appendChild: vi.fn() };
    vi.spyOn(document, "createDocumentFragment").mockReturnValue(
      mockFragment as any,
    );

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "page", pageNumber: "1" },
      { itemType: "page", pageNumber: "2" },
      { itemType: "page", pageNumber: "3" },
    ];

    paginaton.getFilteredPaginationFragmentForPageNavItems(pageNavItems);

    expect(mockFragment.appendChild).toHaveBeenCalledTimes(3);
  });

  it("should clear cloned element id", () => {
    let clonedId = "";

    const mockLink = {
      href: "https://example.com/page?p=",
      textContent: "",
      text: "",
      id: "",
    };

    const mockLi = {
      cloneNode: vi.fn(function (this: any) {
        const cloned = {
          id: "will-be-cleared",
          querySelector: vi.fn(() => mockLink),
        };
        Object.defineProperty(cloned, "id", {
          set: (value) => {
            clonedId = value;
          },
          get: () => clonedId,
        });
        return cloned;
      }),
      querySelector: vi.fn(() => mockLink),
      id: "original-id",
    };

    const mockContent = {
      cloneNode: vi.fn(() => ({
        querySelector: vi.fn(() => mockLi),
      })),
    };

    const mockTemplate = Object.create(HTMLTemplateElement.prototype);
    Object.defineProperty(mockTemplate, "content", {
      value: mockContent,
      writable: false,
      configurable: true,
    });

    vi.spyOn(document, "getElementById").mockReturnValue(mockTemplate);
    vi.spyOn(document, "createDocumentFragment").mockReturnValue({
      appendChild: vi.fn(),
    } as any);

    const pageNavItems: PageNavItemModel[] = [
      { itemType: "page", pageNumber: "1" },
    ];

    paginaton.getFilteredPaginationFragmentForPageNavItems(pageNavItems);

    expect(clonedId).toBe("");
  });
});
