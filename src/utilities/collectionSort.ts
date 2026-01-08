export const sortCollection = (a: any, b: any, fieldName: string) => {
  return new Date(b[fieldName])?.getTime() - new Date(a[fieldName])?.getTime();
};

export const sortCollectionByPublishedAt = (a: any, b: any) => {
  return sortCollection(a, b, "publishedAt");
};

export const sortCollectionBySortField = (a: any, b: any) => {
  return sortCollection(a, b, "sortField");
};
