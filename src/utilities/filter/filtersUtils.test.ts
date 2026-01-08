import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cloneElementWithId } from "@/utilities/filter/filtersUtils";

describe("Filters Utility, cloneElementWithId", () => {
  beforeEach(() => {
    vi.spyOn(document, "getElementById").mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null when original element is not found", () => {
    vi.spyOn(document, "getElementById").mockReturnValue(null);
    expect(cloneElementWithId("non-existent", "cloned")).toBeNull();
  });

  it("should clone element and set new id", () => {
    const mockClone = {
      id: "",
      style: { display: "block" },
      replaceChildren: vi.fn(),
    };

    const mockParent = {
      appendChild: vi.fn(),
    };

    const mockOriginal = {
      cloneNode: vi.fn(() => mockClone),
      parentElement: mockParent,
    };

    vi.spyOn(document, "getElementById").mockReturnValue(mockOriginal as any);

    const result = cloneElementWithId("original-id", "cloned-id");

    expect(mockOriginal.cloneNode).toHaveBeenCalledWith(true);
    expect(result).toEqual({
      original: mockOriginal,
      filtered: mockClone,
    });
    expect(mockClone.id).toBe("cloned-id");
    expect(mockClone.style.display).toBe("none");
    expect(mockClone.replaceChildren).toHaveBeenCalled();
    expect(mockParent.appendChild).toHaveBeenCalledWith(mockClone);
  });
});
