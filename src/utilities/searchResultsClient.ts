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

  const response = await fetch(
    `https://api.gsa.gov/technology/searchgov/v2/results/i14y?query=${encodeURIComponent(query)}&affiliate=${affiliate}&access_key=${apiKey}`,
  );
  const data = await response.json();
  const results = data.web?.results ?? [];

  countContainer.textContent = `${results.length} results`;

  if (results.length === 0) {
    resultsContainer.innerHTML = `<li>No results found.</li>`;
    return;
  }

  resultsContainer.innerHTML = results
    .map(
      (result) => `
      <div class="grid-container result search-result-item">
        <div class="grid-row grid-gap-md result-meta-grid-wrapper">
          <div class="grid-col result-meta-data">
            <div class="result-title">
              <h2 class="result-title-label">
                <a href="${result.url}" target="_blank" rel="noopener noreferrer" class="usa-link">${highlightKeyword(result.title)}</a>
              </h2>
            </div>
            <div class="result-desc">
              <p>${highlightKeyword(result.snippet)}</p>
              <div class="result-url-text">${result.url}</div>
            </div>
          </div>
        </div>
        <div class="grid-row row-mobile-divider"></div>
      </div>
    `,
    )
    .join("");
}
