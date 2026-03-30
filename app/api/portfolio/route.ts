import { sanityClient, urlFor, isSanityConfigured } from '@/app/lib/sanity';
import type { NextRequest } from 'next/server';

const PER_PAGE = 18;

const PORTFOLIO_GROQ = `
  count(*[_type == "portfolioItem"])
`;

const PORTFOLIO_PAGE_GROQ = `
  *[_type == "portfolioItem"] | order(_createdAt desc) [$start...$end] {
    _id,
    title,
    description,
    url,
    "image": image
  }
`;

interface PortfolioItem {
  _id: string;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: unknown;
}

/**
 * GET /api/portfolio?page=1
 * Returns paginated portfolio items from Sanity (type: portfolioItem).
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
 */
export async function GET(request: NextRequest) {
  if (!isSanityConfigured()) {
    return Response.json(
      { error: 'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID (and optionally NEXT_PUBLIC_SANITY_DATASET).' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  try {
    const [total, items] = await Promise.all([
      sanityClient.fetch<number>(PORTFOLIO_GROQ),
      sanityClient.fetch<PortfolioItem[]>(PORTFOLIO_PAGE_GROQ, { start, end }),
    ]);

    const pages = Math.ceil((total || 0) / PER_PAGE) || 1;
    const photos = (items || []).map((item) => {
      const image = item.image;
      const imageUrl = image ? urlFor(image) : null;
      return {
        id: item._id,
        title: item.title || '',
        description: item.description || '',
        url: item.url || null,
        urlMedium: imageUrl ? imageUrl.width(500).url() : null,
        urlLarge: imageUrl ? imageUrl.width(640).url() : null,
        urlModal: imageUrl ? imageUrl.width(1200).url() : null,
      };
    });

    return Response.json({
      photos,
      page,
      pages,
      total: total || 0,
      perPage: PER_PAGE,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch portfolio from Sanity';
    return Response.json(
      { error: message },
      { status: 502 }
    );
  }
}
