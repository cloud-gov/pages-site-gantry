import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CollectionItem from './CollectionItem.astro';

describe('CollectionItem', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  type AstroRender = string | { html: string };
  const renderHTML = async (props: Record<string, any>) => {
    const res = (await container.renderToString(CollectionItem, { props })) as AstroRender;
    return typeof res === 'string' ? res : res.html;
  };

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  afterEach(async () => {
    await (container as any)?.destroy?.();
  });

  it('renders with minimal props', async () => {
    const html = await renderHTML({
      title: 'Test Report',
      link: '/test',
      description: 'A report summary',
    });

    expect(html).toContain('Test Report');
    expect(html).toContain('A report summary');
    expect(html).toContain('href="/test"');
  });

  it('hides description when omitted', async () => {
    const html = await renderHTML({
      title: 'No Description',
      link: '/no-desc',
    });

    expect(html).toContain('No Description');
    expect(html).toContain('href="/no-desc"');
    expect(html).not.toContain('usa-collection__description');
  });

  it('renders image with src and alt when provided', async () => {
    const html = await renderHTML({
      title: 'With Image',
      link: '/img',
      image: '/img.jpg',
      imageAlt: 'Image description',
    });

    expect(html).toContain('class="usa-collection__img"');
    expect(html).toContain('src="/img.jpg"');
    expect(html).toContain('alt="Image description"');
  });

  it('does not render image if none is provided', async () => {
    const html = await renderHTML({
      title: 'No Image',
      link: '/no-img',
    });

    expect(html).not.toContain('usa-collection__img');
    expect(html).not.toContain('<img');
  });

  it('renders tags block when tags are provided', async () => {
    const html = await renderHTML({
      title: 'With Tags',
      link: '/tags',
      tags: [
        { label: 'News', url: '/?category=news' },
        { label: 'UX', url: '/?category=ux' },
      ],
    });

    expect(html).toContain('usa-collection__meta');
    expect(html).toContain('More information'); // aria-label text
    expect(html).toContain('News');
    expect(html).toContain('UX');
  });

  it('does not render tags block when tags are omitted or empty', async () => {
    const html = await renderHTML({
      title: 'No Tags',
      link: '/no-tags',
      tags: [],
    });

    expect(html).not.toContain('usa-collection__meta');
  });

  it('renders with bare minimum', async () => {
    const html = await renderHTML({
      title: 'Bare minimum',
      link: '/bare',
    });

    expect(html).toContain('Bare minimum');
    expect(html).toContain('href="/bare"');
    expect(html).not.toContain('<img');
  });
});
