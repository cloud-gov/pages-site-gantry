import { fetchSearchResults } from "@/utilities/fetch";

export function highlightKeyword(string: string): string {
  return string.replace(/\uE000/g, "<strong>").replace(/\uE001/g, "</strong>");
}

export async function renderSearchResults({
  query,
  affiliate,
  apiKey,
  resultsContainerId = "search-results",
  countContainerId = "results-count",
}: {
  query: string;
  affiliate: string;
  apiKey: string;
  resultsContainerId?: string;
  countContainerId?: string;
}) {
  const resultsContainer = document.getElementById(resultsContainerId);
  const countContainer = document.getElementById(countContainerId);

  if (!query || !resultsContainer || !countContainer) return;
  const results = await fetchSearchResults(affiliate, apiKey, query);

  countContainer.textContent = `${results.length} results`;

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
