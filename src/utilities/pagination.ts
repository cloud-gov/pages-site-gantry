import navigate_next from "@uswds-images/usa-icons/navigate_next.svg";
import navigate_before from "@uswds-images/usa-icons/navigate_before.svg";
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

export function searchPagination(
  totalPages: number,
  currentPage: number,
  limit: number,
) {
  function getPageNumbers(totalPages: number, currentPage: number) {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let lastSeenPage;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (lastSeenPage) {
        if (i - lastSeenPage === 2) {
          rangeWithDots.push(lastSeenPage + 1);
        } else if (i - lastSeenPage > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      lastSeenPage = i;
    }

    return rangeWithDots;
  }

  const pages = getPageNumbers(totalPages, currentPage);

  const pagination = `
    <nav aria-label="Pagination" class="usa-pagination">
      <ul class="usa-pagination__list">
        ${
          currentPage > 1
            ? `<li class="usa-pagination__item usa-pagination__arrow">
              
              <a 
                href="#"
                data-page="${(currentPage - 2) * limit + 1}"
              class="page-number usa-pagination__link usa-pagination__previous-page"
        aria-label="Previous page">
                <svg class="usa-icon" aria-hidden="true" role="img">
                  <use href="${navigate_before.src}" width="${navigate_before.width}" />
                </svg>
                <span class="usa-pagination__link-text"> Previous</span>
              </a>
            </li>`
            : ""
        }
        ${pages
          .map((p) =>
            p === "..."
              ? `<li
                  class="usa-pagination__item usa-pagination__overflow"
                  aria-label="ellipsis indicating non-visible pages"
                >
                  <span>…</span>
                </li>
              `
              : `<li class="usa-pagination__item usa-pagination__page-no">
                <a
                  class="${`page-number usa-pagination__button${p === currentPage ? " usa-current" : ""}`}"
                  href="#"
                  data-page="${p === 1 ? "" : Number((p - 1) * limit + 1)}"
                  aria-current=""
                  aria-label="${`Page ${p}`}"
                >
                  ${p}
                </a>
              </li>`,
          )
          .join("")}

        ${
          currentPage < totalPages
            ? `<li class="usa-pagination__item usa-pagination__arrow">
              <a
                class="page-number usa-pagination__link usa-pagination__next-page"
                aria-label="Next page"
                href="#"
                data-page="${currentPage * limit + 1}"
              >
                <span class="usa-pagination__link-text"">Next </span>
                <svg class="usa-icon" aria-hidden="true" role="img" width="${navigate_next.width}">
                  <use href="${navigate_next.src}" />
                </svg>
              </a>
            </li>`
            : ""
        }
      </ul>
    </nav>
  `;

  return pagination;
}
