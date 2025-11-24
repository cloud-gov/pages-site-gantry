import { fetchSiteConfig } from "./queries";
import type { SiteConfig } from "@/env";

/**
 * Resolves the actual collection name from a URL slug
 * Checks if the slug matches a custom slug for the General collection
 * @param urlSlug - The slug from the URL (e.g., "articles", "resources")
 * @returns The actual collection name to use in API calls ("general" or the original slug)
 */
export async function resolveCollectionFromSlug(urlSlug: string): Promise<string> {
  // If it's already a known collection, return it
  const knownCollections = ['events', 'news', 'leadership', 'posts', 'reports', 'resources'];
  if (knownCollections.includes(urlSlug)) {
    return urlSlug;
  }

  // Check if it's a custom slug for General collection
  try {
    const siteConfig: SiteConfig = await fetchSiteConfig();
    const displayNames = siteConfig?.collectionDisplayNames || [];
    
    const generalConfig = displayNames.find(
      (item) => item.collectionSlug === 'general'
    );
    
    // If the URL slug matches the custom slug for General, return 'general'
    if (generalConfig?.customSlug && generalConfig.customSlug === urlSlug) {
      return 'general';
    }
  } catch (error) {
    console.warn(`Could not resolve collection from slug ${urlSlug}:`, error);
  }

  // Default: assume it's 'general' if not found (for backwards compatibility)
  // Or return the original slug if it doesn't match
  return urlSlug === 'general' ? 'general' : urlSlug;
}

/**
 * Gets the URL slug to use for a collection
 * Returns custom slug if set, otherwise returns the default collection slug
 * @param collectionSlug - The collection slug (e.g., "general")
 * @param defaultSlug - The default slug to use
 * @returns The URL slug to use in routes
 */
export async function getCollectionUrlSlug(
  collectionSlug: string,
  defaultSlug: string
): Promise<string> {
  try {
    const siteConfig: SiteConfig = await fetchSiteConfig();
    const displayNames = siteConfig?.collectionDisplayNames || [];
    
    const match = displayNames.find(
      (item) => item.collectionSlug === collectionSlug
    );
    
    // Return custom slug if set, otherwise use default
    return match?.customSlug || defaultSlug;
  } catch (error) {
    console.warn(`Could not fetch collection URL slug for ${collectionSlug}:`, error);
    return defaultSlug;
  }
}


