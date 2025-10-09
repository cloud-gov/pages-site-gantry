export function paginate<T>(items: T[], currentPage: number, pageSize: number) {
  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return {
    totalPages,
    paginatedItems,
  };
}
