import { fetchSiteConfig } from "./queries";
import type { SiteConfig } from "@/env";

/**
 * Gets the display name for a collection from SiteConfig
 * @param collectionSlug - The collection slug (e.g., "general", "events")
 * @param defaultName - Fallback name if not found in config
 * @returns The display name to use on the frontend
 */
export async function getCollectionDisplayName(
  collectionSlug: string,
  defaultName?: string
): Promise<string> {
  try {
    const siteConfig: SiteConfig = await fetchSiteConfig();
    const displayNames = siteConfig?.collectionDisplayNames || [];
    
    const match = displayNames.find(
      (item) => item.collectionSlug === collectionSlug
    );
    
    return match?.displayName || defaultName || collectionSlug;
  } catch (error) {
    console.warn(`Could not fetch collection display name for ${collectionSlug}:`, error);
    return defaultName || collectionSlug;
  }
}

/**
 * Gets the custom URL slug for a collection from SiteConfig
 * @param collectionSlug - The collection slug (e.g., "general")
 * @param defaultSlug - Fallback slug if not found in config
 * @returns The URL slug to use on the frontend
 */
export async function getCollectionCustomSlug(
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
    console.warn(`Could not fetch collection custom slug for ${collectionSlug}:`, error);
    return defaultSlug;
  }
}

/**
 * Helper to capitalize first letter of each word (for default names)
 * Example: "general" -> "General", "blog-posts" -> "Blog Posts"
 */
export function formatDefaultName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

