import { describe, it, expect, vi, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SearchResults from './SearchResults.astro';

const mockResults = {
  web: {
    results: [
      {
        title: 'Example Search Result',
        snippet: 'This is a highlighted snippet.',
        url: 'https://example.com',
      }
    ]
  }
}

describe('SearchResults Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockResults),
      })
    ));
  });

  it('renders search results with highlighted terms', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SearchResults, { props: { query: 'search' }});

    expect (result).toContain('<strong>Search</strong>');
    expect (result).toContain('<strong>highlighted</strong>');
    expect (result).toContain('https://example.com');
  })
});