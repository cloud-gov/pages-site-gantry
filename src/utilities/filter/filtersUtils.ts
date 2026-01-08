import type { ElementsPair, FilterSelection } from "@/env";

export function createDocumentFragment(clones: Awaited<Node>[]) {
  const nodes = clones?.filter(Boolean);
  if (!nodes?.length) return null;

  const fragment = document.createDocumentFragment();
  nodes.forEach((clone) => fragment.appendChild(clone));

  return fragment;
}

export function cloneElementWithId(
  originalId: string,
  clonedId: string,
): ElementsPair {
  const original = document.getElementById(originalId);
  if (!original) return null;

  const clone = original.cloneNode(true) as HTMLElement;
  clone.id = clonedId;
  clone.style.display = "none";
  clone.replaceChildren();

  const parentContainer = original.parentElement;
  parentContainer.appendChild(clone);
  return { original, filtered: clone };
}

export function appendQuery(
  linkUrl,
  filterSelections: Map<string, FilterSelection>,
) {
  const url = new URL(linkUrl, window.location.href);
  filterSelections?.forEach((filterSelection) => {
    url.searchParams.set(
      filterSelection.filterName,
      filterSelection.selectedValue,
    );
  });
  return url;
}
