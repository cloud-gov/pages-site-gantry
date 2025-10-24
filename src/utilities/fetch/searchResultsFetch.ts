export async function fetchSearchResults(
  affiliate: string,
  apiKey: string,
  query: string,
) {
  const response = await fetch(
    `https://api.gsa.gov/technology/searchgov/v2/results/i14y?affiliate=${affiliate}&access_key=${apiKey}&query=${encodeURIComponent(query)}`,
  );
  const data = await response.json();
  const results = data.web?.results ?? [];
  return results;
}
