import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import FiltersSlugMetaData from "./FiltersSlugMetaData.astro";
import { getFiltersSlugMetaData } from "@/utilities/filters";

describe("FiltersConfig", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("does not add pagefind metadata if none", async () => {
    const result = await container.renderToString(FiltersSlugMetaData, {
      props: { filtersConfig: null },
    });
    expect(result).toEqual("");
  });

  it("adds pagefind metadata", async () => {
    let collectionName = "events";
    let collectionItem = {
      tags: [{ label: "GEOGRAPHY" }, { label: "HISTORY" }],
      yearTag: "2025",
    };
    let slug = "virtual-qa-session-unlocking-industry-insights";

    getFiltersSlugMetaData(collectionName, collectionItem, slug);

    const result = await container.renderToString(FiltersSlugMetaData, {
      props: {
        filtersConfig: getFiltersSlugMetaData(
          collectionName,
          collectionItem,
          slug,
        ),
      },
    });
    expect(result).toEqual(
      '<meta data-pagefind-meta="collectionItemId:events-virtual-qa-session-unlocking-industry-insights">' +
        '<meta data-pagefind-filter="events_tag[content]" content="GEOGRAPHY">' +
        '<meta data-pagefind-filter="events_tag[content]" content="HISTORY">' +
        '<meta data-pagefind-filter="events_year[content]" content="2025">',
    );
  });
});
