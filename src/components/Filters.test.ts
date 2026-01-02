import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Filters from "./Filters.astro";
import { FILTERS_DATA_ID } from "@/utilities/filter";

describe("Filters", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("does not add metadata if none exists", async () => {
    const result = await container.renderToString(Filters, {
      props: { filteredPageConfig: null },
    });
    expect(result).not.toContain(`span id=${FILTERS_DATA_ID}`);
  });
});
