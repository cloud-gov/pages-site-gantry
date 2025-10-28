import { createGetStaticPathForPages } from "@/utilities/fetch/staticPath";

export {
  fetchSiteConfig,
  fetchMenu,
  fetchHomePage,
  fetchPageSlug,
  fetchSlug,
  fetchCollection,
  fetchPreFooter,
} from "./queries";
export { getPaginatedCollectionData } from "./collectionDataFetch";
export {
  createGetStaticPath,
  createPagingStaticPath,
  createGetStaticPathForPages,
  createStaticPathsForPagesSlug,
} from "./staticPath";
export { collectionLoader } from "./collectionLoader";
export { preFooterMapper } from "./preFooterMapper";
