import { render, waitFor } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Home from '@/app/page';
import About from '@/app/about/page';
import Portfolio from '@/app/portfolio/page';
import Contact from '@/app/contact/page';
import NotFound from '@/app/not-found';

jest.mock('@portabletext/react', () => ({
  PortableText: () => <span data-testid="portable-text-placeholder" />,
}));

jest.mock('@/app/lib/sanity', () => ({
  sanityClient: {},
  urlFor: jest.fn(() => ({
    width: () => ({
      height: () => ({
        fit: () => ({
          auto: () => ({
            url: () => 'https://example.com/sanity-image.jpg',
          }),
        }),
      }),
    }),
  })),
  isSanityConfigured: jest.fn(() => false),
}));

jest.mock('@/app/lib/about', () => ({
  getAboutPageContent: jest.fn().mockResolvedValue(null),
  resolvePortraitAlt: () => 'Kayt and Ryan',
}));

const mockFetch = (url: string) => {
  if (url.startsWith('/api/portfolio'))
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ photos: [], page: 1, pages: 0, total: 0 }),
    });
  return Promise.reject(new Error('unexpected fetch'));
};
beforeAll(() => {
  global.fetch = mockFetch as typeof fetch;
});

const VALID_INTERNAL_PATHS = ['/', '/about', '/portfolio', '/contact', '/shop'];

function getAllLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll('a[href]'));
}

function getLinkHrefs(container: HTMLElement): string[] {
  return getAllLinks(container).map((a) => a.getAttribute('href')!.trim());
}

describe('All links have valid hrefs', () => {
  it('Navigation links have valid hrefs', () => {
    const { container } = render(<Navigation />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      if (href.startsWith('/')) {
        expect(VALID_INTERNAL_PATHS).toContain(href);
      } else {
        expect(href).toMatch(/^https?:\/\//);
      }
    });
  });

  it('Footer links have valid hrefs', () => {
    const { container } = render(<Footer />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    });
  });

  it('Contact page links have valid hrefs', () => {
    const { container } = render(<Contact />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThanOrEqual(4);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      expect(href).toMatch(/^(https?:\/\/|tel:|mailto:)/);
    });
    expect(hrefs.some((href) => href.startsWith('tel:'))).toBe(true);
    expect(hrefs.some((href) => href.startsWith('mailto:'))).toBe(true);
  });

  it('Home page only links to the Dragon\'s Purr brand site in content', () => {
    const { container } = render(<Home />);
    const links = getAllLinks(container);
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('https://dragonspurr.ca');
  });

  it('About page has no links in content', async () => {
    const ui = await About();
    const { container } = render(ui);
    const links = getAllLinks(container);
    expect(links.length).toBe(0);
  });

  it('Portfolio page has no links in content', async () => {
    const { container } = render(<Portfolio />);
    await waitFor(() => {
      expect(container.querySelector('.animate-pulse')).toBeNull();
    });
    const links = getAllLinks(container);
    expect(links.length).toBe(0);
  });

  it('Not-found page has no links in content', () => {
    const { container } = render(<NotFound />);
    const links = getAllLinks(container);
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/');
  });
});

describe('All expected links are present and resolve to correct targets', () => {
  it('Navigation contains all expected internal and external links', () => {
    const { container } = render(<Navigation />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/portfolio');
    expect(hrefs).toContain('/contact');
    expect(hrefs).toContain('/shop');
  });

  it('Footer contains expected external links', () => {
    const { container } = render(<Footer />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.filter((h) => h === 'https://dragonspurr.ca').length).toBe(1);
    expect(hrefs.filter((h) => h === 'https://boxingoctop.us').length).toBe(1);
  });

  it('Contact page phone and email links resolve to expected targets', () => {
    const { container } = render(<Contact />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs).toContain('tel:14165551234');
    expect(hrefs.filter((href) => href.startsWith('mailto:info@hipsterdonut.ca')).length).toBe(3);
  });
});
