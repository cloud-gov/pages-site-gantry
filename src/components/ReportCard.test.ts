import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ReportCard from './ReportCard.astro';

describe('ReportCard', () => {
  let container;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders with minimal props', async () => {
    const result = await container.renderToString(ReportCard, {
      props: {
        title: 'Test Report',
        link: '/test',
        description: 'A report summary',
      },
    });

    expect(result).toContain('Test Report');
    expect(result).toContain('A report summary');
    expect(result).toContain('/test');
  });

  it('renders a date when provided', async () => {
    const result = await container.renderToString(ReportCard, {
      props: {
        title: 'Test Report',
        link: '/test',
        date: "2024-12-31"
      },
    });

    expect(result).toContain("2024-12-31");
  });

  it('does not render date when omitted', async () => {
    const result = await container.renderToString(ReportCard, {
      props: {
        title: 'Test Report',
        link: '/test',
      },
    });

    expect(result).toContain('ul class="usa-collection__meta"');
    expect(result).not.toContain("2024-12-31");
  });

});
