/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { getAboutPageContent } from '@/app/lib/about';
import { isSanityConfigured } from '@/app/lib/sanity';
import About from '@/app/about/page';

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
  isSanityConfigured: jest.fn(() => true),
}));

jest.mock('@/app/lib/about', () => ({
  getAboutPageContent: jest.fn(),
  resolvePortraitAlt: () => 'Kayt and Ryan',
}));

const mockGetAboutPageContent = getAboutPageContent as jest.MockedFunction<typeof getAboutPageContent>;
const mockIsSanityConfigured = isSanityConfigured as jest.MockedFunction<typeof isSanityConfigured>;

const mockCmsAboutPage = {
  portraitImage: { _type: 'image', asset: { _ref: 'image-portrait' } },
  whoWeAreTitle: 'Who We Are',
  whoWeAreBody: [
    {
      _type: 'block',
      _key: 'w1',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 'c1', text: 'CMS who we are.', marks: [] }],
    },
  ],
  whatWeMakeTitle: 'What We Make',
  whatWeMakeBody: [
    {
      _type: 'block',
      _key: 'm1',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 'c2', text: 'CMS what we make.', marks: [] }],
    },
  ],
};

async function renderAboutPage() {
  const ui = await About();
  render(ui);
}

describe('About page', () => {
  beforeEach(() => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockGetAboutPageContent.mockResolvedValue(mockCmsAboutPage);
  });

  it('renders the profile image with correct alt text', async () => {
    await renderAboutPage();
    const img = screen.getByRole('img', { name: /kayt and ryan/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Kayt and Ryan');
  });

  it('profile image src comes from Sanity', async () => {
    await renderAboutPage();
    const img = screen.getByRole('img', { name: /ryan/i });
    expect(img.getAttribute('src')).toContain('sanity-image.jpg');
  });

  it('renders PortableText for each section when CMS provides body fields', async () => {
    await renderAboutPage();
    expect(screen.getAllByTestId('portable-text-placeholder')).toHaveLength(2);
  });

  it('renders section titles from CMS', async () => {
    await renderAboutPage();
    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText('What We Make')).toBeInTheDocument();
  });

  it('renders studio prompt when portrait image is missing', async () => {
    mockGetAboutPageContent.mockResolvedValueOnce({
      ...mockCmsAboutPage,
      portraitImage: null,
    });
    await renderAboutPage();
    expect(screen.getByText(/no about page content yet/i)).toBeInTheDocument();
    expect(screen.getByText(/\/studio/)).toBeInTheDocument();
  });

  it('renders no PortableText when body fields are empty', async () => {
    mockGetAboutPageContent.mockResolvedValueOnce({
      portraitImage: mockCmsAboutPage.portraitImage,
      whoWeAreTitle: 'Who We Are',
      whoWeAreBody: null,
      whatWeMakeTitle: 'What We Make',
      whatWeMakeBody: null,
    });
    await renderAboutPage();
    expect(screen.queryByTestId('portable-text-placeholder')).not.toBeInTheDocument();
  });

  it('renders studio prompt when Sanity returns no document', async () => {
    mockGetAboutPageContent.mockResolvedValueOnce(null);
    await renderAboutPage();
    expect(screen.getByText(/no about page content yet/i)).toBeInTheDocument();
  });

  it('renders env setup message when Sanity is not configured', async () => {
    mockIsSanityConfigured.mockReturnValueOnce(false);
    const ui = await About();
    render(ui);
    expect(screen.getByText(/NEXT_PUBLIC_SANITY_PROJECT_ID/i)).toBeInTheDocument();
    expect(screen.getByText(/NEXT_PUBLIC_SANITY_DATASET/i)).toBeInTheDocument();
  });

  it('renders error when Sanity fetch throws', async () => {
    mockGetAboutPageContent.mockRejectedValueOnce(new Error('network'));
    const ui = await About();
    render(ui);
    expect(screen.getByText(/could not load about page content/i)).toBeInTheDocument();
  });
});
