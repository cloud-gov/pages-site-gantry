export type AnyFilterValue = string | string[];

export function buildAnyFilters(
  entries: Iterable<[string, string]>,
): { filters: { any: Record<string, AnyFilterValue> } } | null {
  const anyFilters: Record<string, AnyFilterValue> = {};

  for (const [facetKey, rawValue] of entries) {
    if (!rawValue) continue;

    const values = rawValue.split(",").map((v) => v.trim());

    anyFilters[facetKey] = values.length === 1 ? values[0] : values;
  }

  if (Object.keys(anyFilters).length === 0) {
    return null;
  }

  return {
    filters: {
      any: anyFilters,
    },
  };
}
