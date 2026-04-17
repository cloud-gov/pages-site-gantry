/**
 * Navigation utilities for organizing and managing side navigation
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
  order?: number;
  tag?: string;
}

/**
 * Organizes navigation items by tag and sorts them
 */
export function organizeNavItems(items: NavItem[]): NavItem[] {
  // Group items by tag
  const categorized = items.reduce(
    (acc, item) => {
      const tag = item.tag || "general";
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  // Sort items within each tag and create organized structure
  const organized: NavItem[] = [];

  // Add general items first
  if (categorized.general) {
    organized.push(
      ...categorized.general.sort((a, b) => (a.order || 0) - (b.order || 0)),
    );
  }

  // Add other tags
  Object.entries(categorized)
    .filter(([tag]) => tag !== "general")
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([tag, items]) => {
      const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0));
      organized.push(...sortedItems);
    });

  return organized;
}

/**
 * Creates a hierarchical navigation structure from flat page data
 */
export function createNavFromPages(pages: any[]): NavItem[] {
  return pages
    .filter((page) => page.slug && page.title)
    .map((page) => ({
      id: page.id.toString(),
      label: page.title,
      href: `/${page.slug}`,
      order: page.order || 0,
      tag: page.tag || "general",
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Finds the current page in navigation and marks it as active
 */
export function findActiveNavItem(
  items: NavItem[],
  currentPath: string,
): NavItem | null {
  for (const item of items) {
    if (item.href === currentPath) {
      return item;
    }
    if (item.children) {
      const found = findActiveNavItem(item.children, currentPath);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Creates a breadcrumb trail from navigation items
 */
export function createBreadcrumbs(
  items: NavItem[],
  currentPath: string,
): NavItem[] {
  const breadcrumbs: NavItem[] = [];

  function findPath(items: NavItem[], path: string[] = []): boolean {
    for (const item of items) {
      const newPath = [...path, item];

      if (item.href === currentPath) {
        breadcrumbs.push(...(newPath as NavItem[]));
        return true;
      }

      if (item.children && findPath(item.children, newPath as string[])) {
        return true;
      }
    }
    return false;
  }

  findPath(items);
  return breadcrumbs;
}

/**
 * Converts Payload CMS menu items to side navigation format
 */
export function convertMenuToSideNav(menuItems: any[]): NavItem[] {
  return menuItems
    .map((item: any) => {
      let href = "#";

      // Handle different menu item types
      switch (item.blockType) {
        case "pageLink":
          href = `${item.page?.slug || ""}`;
          break;
        case "externalLink":
          href = item.url || "";
          break;
        case "collectionTypeLink":
          href = `/${item.collectionType?.slug || ""}`;
          break;
        case "collectionEntryLink":
          href = `/${item.collectionEntry?.collectionSlug}/${item.collectionEntry?.slug}`;
          break;
        case "link":
          href = item.url || "";
      }

      return {
        id: item.id || Math.random().toString(36).substr(2, 9),
        label: item.label,
        href: href,
        order: item.order || 0,
        children: item.subitems
          ? item.subitems
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((subitem: any) => {
                let subHref = "#";
                if (subitem.blockType === "pageLink" && subitem.page) {
                  subHref = `/${subitem.page.slug}`;
                } else if (subitem.blockType === "collectionLink") {
                  subHref = `/${subitem.page}`;
                } else if (
                  subitem.blockType === "externalLink" &&
                  subitem.url
                ) {
                  subHref = subitem.url;
                }

                return {
                  id: subitem.id || Math.random().toString(36).substr(2, 9),
                  label: subitem.label,
                  href: subHref,
                  order: subitem.order || 0,
                };
              })
          : undefined,
      };
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}
