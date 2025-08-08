import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CollectionItem from './CollectionItem.astro';

describe('CollectionItem', () => {
  let container;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders with minimal props', async () => {
    const result = await container.renderToString(CollectionItem, {
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
    const result = await container.renderToString(CollectionItem, {
      props: {
        title: 'Test Report',
        link: '/test',
        date: "2024-12-31"
      },
    });

    expect(result).toContain("2024-12-31");
  });

  it('does not render date when omitted', async () => {
    const result = await container.renderToString(CollectionItem, {
      props: {
        title: 'Test Report',
        link: '/test',
      },
    });

    expect(result).toContain('ul class="usa-collection__meta"');
    expect(result).not.toContain("2024-12-31");
  }); 

  it('renders image with a src and alt', async () => {
     const result = await container.renderToString(CollectionItem, {
      props: {
        title: 'Test Report',
        link: '/test',
        image: "/img.jpg",
        imageAlt: "Image description",
      },
    });

    expect(result).toContain('<img class="usa-collection__img"');
    expect(result).toContain('src="/img.jpg"');
    expect(result).toContain('alt="Image description');
  });

  it('does not render image if none is provided', async () => {
    const result = await container.renderToString(CollectionItem, {
      props: {
        title: 'Test Report',
        link: '/test',
      },
    });

    expect(result).not.toContain("usa-collection__img");
  }); 

  it('renders with bare minimum', async () => {
     const result = await container.renderToString(CollectionItem, {
      props: {
        title: 'Bare minimum',
        link: '/bare',
      },
    });

    expect(result).toContain('Bare minimum');
    expect(result).toContain('/bare');
    expect(result).not.toContain('<img');
    expect(result).not.toContain('alt="Image description');
  });

});
