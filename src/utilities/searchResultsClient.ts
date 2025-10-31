import { searchPagination } from "./pagination";

export function highlightKeyword(string: string): string {
  return string.replace(/\uE000/g, "<strong>").replace(/\uE001/g, "</strong>");
}

export function countResults(totalResults, resultsShown, offset, query) {
  if (totalResults === 0 || undefined) {
    return `
        We didn't find any results for "<strong>${query}</strong>." Try using different words or checking the spelling of the words you're using.
        `;
  }

  const start = offset !== null ? offset : 1;
  const end = Math.min(
    Number(start) + Number(resultsShown) - 1,
    Number(totalResults),
  );

  if (resultsShown === totalResults) {
    return `Showing 1-${totalResults} results for "<strong>${query}</strong>"`;
  }

  return `Showing ${start}-${end} of ${totalResults} results for "<strong>${query}</strong>"`;
}

export async function renderSearchResults({
  query,
  affiliate,
  apiKey,
  resultsContainerId = "search-results",
  countContainerId = "results-count",
  pageValueOffset = null,
  limit = 10,
}: {
  query: string;
  affiliate: string;
  apiKey: string;
  resultsContainerId?: string;
  countContainerId?: string;
  pageValueOffset?: number;
  limit?: number;
}) {
  const countContainer = document.getElementById(countContainerId);
  const resultsContainer = document.getElementById(resultsContainerId);
  const paginationContainer = document.getElementById("pagination");

  if (!query || !resultsContainer || !countContainer) return;

  const response = await fetch(
    `https://api.gsa.gov/technology/searchgov/v2/results/i14y?affiliate=${affiliate}&access_key=${apiKey}&offset=${pageValueOffset}&limit=${limit}&query=${encodeURIComponent(query)}`,
  );
  const data = await response.json();
  const results = data.web?.results ?? [];

  if (results) {
    countContainer.innerHTML = `<p>${countResults(data.web?.total, results.length, pageValueOffset, query)}</p>`;
    countContainer.innerHTML += `<hr class="margin-bottom-3 margin-top-3" />`;
    if (data.web?.total > limit) {
      paginationContainer.innerHTML = searchPagination(
        data.web?.total,
        1,
        limit,
      );
    }
  }

  if (results.length === 0) {
    resultsContainer.innerHTML = `<li>No results found.</li>`;
    return;
  }

  resultsContainer.innerHTML = results
    .map(
      (result) => `
        <div class="result-title">
          <h2 class="result-title-label">
            <a href="${result.url}" target="_blank" rel="noopener noreferrer" class="usa-link">${highlightKeyword(result.title)}</a>
          </h2>
        </div>
        <div class="result-desc">
          <p>${highlightKeyword(result.snippet)}</p>
          <div class="result-url-text">${result.url}</div>
        </div>
      `,
    )
    .join("");
}
