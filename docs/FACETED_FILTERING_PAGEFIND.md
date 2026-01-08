# Faceted filtering on collection pages using Pagefind static search library

This document explains how pages-site-gantry integrates and uses the Pagefind library.

## Build and Use Pagefind Index

### Command to create the search index
--site points to the output directory of static site generator:
```
"index": "pagefind --site _site --verbose"
```

### Command to create the index as part of the static build
```
"pages": "npm install --no-package-lock && ASTRO_TELEMETRY_DISABLED=1 RENDER_MODE=static npm run build && npm run index"
```

### Command to use the index locally
The index is built from the static site directory, but at runtime it must be located at the site root. For local development, the index is copied from _site/pagefind to ./pagefind.
```
"index:local": "RENDER_MODE=static astro build && cp -r public/* _site/ && npm run index && rm -rf pagefind && cp -r _site/pagefind ./pagefind",
```

## Static Rendering

1. The **global filters configuration, FILTERS_CONFIG** (located at /src/utilities/filter/filtersConfig.ts), defines the set of faceted filters.
```
// Example

export const FILTER_NAME_TAG = "tag";
export const FILTER_NAME_YEAR = "year";

export const FILTERS_CONFIG: FilterConfig[] = [
{ filterName: FILTER_NAME_TAG, filterLabel: "Filter by document type" },
{ filterName: FILTER_NAME_YEAR, filterLabel: "Filter by year" },
];
```


2. Each **slug page included in a filtered result** ([slug].astro) has two components to support filtering.

    - `<FiltersSlugMetaData>` - provides metadata and filtering configuration data, which is included in the Pagefind index.
    ```
    <!-- Example -->
   
    <!-- Pagefind supports returning custom metadata alongside search results 
         with the data-pagefind-meta attribute-->
    <meta data-pagefind-meta="collectionItemId:events-virtual-qa-session-unlocking-industry-insights">
    <meta data-pagefind-meta="sortField:2026-01-05T17:23:16.181Z">
   
    <!-- Will associate that page with the filter name and value -->
    <meta data-pagefind-filter="events_tag[content]" content="GEOGRAPHY">
    <meta data-pagefind-filter="events_tag[content]" content="HISTORY">
    <meta data-pagefind-filter="events_year[content]" content="2025">
    ```

    - `<FiltersCollectionItemTemplate>` provides a template of the `<CollectionItem>` component for a slug's collection item. This template will be cloned and displayed in the filtered `<CollectionItemsList>` component. 


3. Each **page that should have faceted filters** includes the `<Filters>/<Filter>` components.
   - Each filter uses the `<Filter>` component (based on the [USWDS combo box](https://designsystem.digital.gov/components/combo-box/)). It is hidden during static rendering, with an empty `<select>` element, and is hydrated with options during client-side rendering.
   - `<Filters>` component provides attributes used on the client side to populate filter options and handle filtering.
    ```
     <!-- Example -->
     
     <span id="pagefind-data" 
     data-pagefindfiltertag="reports_tag"
     data-pagefindfilteryear="reports_year" 
     data-pagesize="10"
     data-currentpage="1" 
     data-baseurl="/preview/cloud-gov/pages-site-gantry/feat-Create-filtering-component-126/" 
     data-collectionname="reports" 
     style="display:none"></span>
    ```

4. The `<PaginationNav>` component includes templates of `<PaginationNavItem>` components for all available types: `prev`, `page`, `next`, and `overflow`.  
      These statically rendered templates are cloned on the client side and displayed to provide dynamic pagination for the filtered results.


## Client Side Rendering

Client-side script to support filtering is included in the `<Filters>` component.  

Implementation steps:
1. Retrieve page-specific filtering data from the `<Filters>` component’s data attributes.
2. Retrieve the full list of filters from the Pagefind index.
```
// Example

const pagefindFilters = {
    events_tag: {
    GEOGRAPHY: 1,
    },
    events_year: {
    "2023": 1,
    "2025": 1,
    },
    leadership_year: {
    Unspecified: 3,
    },
    news_year: {
    "2024": 2,
    "2025": 6,
    Unspecified: 1,
    },
    reports_tag: {
    GEOGRAPHY: 8,
    HISTORY: 4,
    INTERNATIONAL: 4,
    SCIENCE: 5,
    SPORTS: 6,
    },
    reports_year: {
    Unspecified: 11,
    },
    resources_tag: {
    GEOGRAPHY: 1,
    HISTORY: 3,
    INTERNATIONAL: 1,
    SCIENCE: 1,
    SPORTS: 3,
    },
    resources_year: {
    Unspecified: 5,
    },
    };
```
3. The statically rendered combo box from the `<Filter>` component is hydrated with filter options applicable to the current page, which are extracted from the full list of filters in the Pagefind index.
4. The `<ul>` element from the statically generated `<CollectionItemList>` component is cloned and used to display filtered results.
When the cloned `<ul>` element with filtered results is displayed, the original statically generated `<ul>` element is hidden.
5. The `<ul>` element from the statically generated `<PaginationNav>` component is cloned and used to display pagination for the filtered results. When the cloned `<ul>` pagination is displayed, the original statically generated `<ul>` element becomes hidden.
6. Listeners with the following actions are fired when filtering options change:

   - Retrieve selections from all filters.
   - If filter selections changed on a filtered page that is different from page "1", the user is redirected to the first collection page with the filter selections included in the URL query.
   - If there are no filters selections, the statically rendered `<CollectionItemList>` and `<PaginationNav>` components are displayed.
   - If there are filters selections, a Pagefind search with the selected filters is triggered.
    ```
    Example of the Pagefind search result:
    [
     {
      title: "Page 1",
      url: "https://example.com/page1",
      meta: { 
             sortField: "2024-01-01",
             collectionItemId: "templateForPage1"},
            },
     {
      title: "Page2",
      url: "https://example.com/page2",
      meta: { 
             sortField: "2022-01-01" },
             collectionItemId: "templateForPage2",
            },
      }],
   ```
   - Render filtered search results:
     - For each found URL (considering pagination), the page is fetched, the element with the `collectionItemId` is cloned, and added as a child to the cloned `<ul>` element of `<CollectionItemList>`. The original statically rendered `<ul>` element of `<CollectionItemList>` is hidden. 
     - Pagination for the filtered results is displayed using clones from the statically generated templates for `<PaginationNavItem>` types: `prev`, `page`, `next`, and `overflow`. The original statically rendered pagination `<ul>` of `<PaginationNavItem>` element is hidden.

7. If the page URL contains query parameters from selected filters, the filters selections are initialized from these parameters, and a Pagefind search is triggered to display the filtered results.

