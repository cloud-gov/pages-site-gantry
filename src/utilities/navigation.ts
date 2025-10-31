/**
 * Navigation utilities for organizing and managing side navigation
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
  order?: number;
  category?: string;
}

/**
 * Organizes navigation items by category and sorts them
 */
export function organizeNavItems(items: NavItem[]): NavItem[] {
  // Group items by category
  const categorized = items.reduce(
    (acc, item) => {
      const category = item.category || "general";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  // Sort items within each category and create organized structure
  const organized: NavItem[] = [];

  // Add general items first
  if (categorized.general) {
    organized.push(
      ...categorized.general.sort((a, b) => (a.order || 0) - (b.order || 0)),
    );
  }

  // Add other categories
  Object.entries(categorized)
    .filter(([category]) => category !== "general")
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([category, items]) => {
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
      category: page.category || "general",
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
        breadcrumbs.push(...newPath);
        return true;
      }

      if (item.children && findPath(item.children, newPath)) {
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
      if (item.blockType === "pageLink" && item.page) {
        href = `/${item.page.slug}`;
      } else if (item.blockType === "collectionLink") {
        href = `/${item.page}`;
      } else if (item.blockType === "externalLink" && item.url) {
        href = item.url;
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
