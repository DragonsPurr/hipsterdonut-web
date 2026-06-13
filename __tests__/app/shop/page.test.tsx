/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { listShopProducts } from '@/app/lib/shop';
import ShopPage from '@/app/shop/page';

jest.mock('@/app/lib/shop', () => ({
  listShopProducts: jest.fn(),
}));

const mockListShopProducts = listShopProducts as jest.MockedFunction<typeof listShopProducts>;

async function renderShopPage() {
  const ui = await ShopPage();
  return render(ui);
}

describe('Shop page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows alert when Medusa is not configured', async () => {
    mockListShopProducts.mockResolvedValue({
      ok: false,
      code: 'missing_config',
      error: 'Shop is not configured. Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.',
    });

    await renderShopPage();

    expect(screen.getByRole('alert')).toHaveTextContent(/not configured/i);
    expect(screen.getByRole('heading', { name: 'Shop' })).toBeInTheDocument();
  });

  it('renders product grid with price and product link', async () => {
    mockListShopProducts.mockResolvedValue({
      ok: true,
      count: 1,
      regionId: 'reg_test',
      products: [
        {
          id: 'prod_1',
          title: 'Dragon Mug',
          handle: 'dragon-mug',
          description: 'A fine mug.',
          thumbnail: 'https://example.com/mug.jpg',
          variants: [
            {
              id: 'var_1',
              calculated_price: {
                calculated_amount: 19.99,
                currency_code: 'cad',
              },
            },
          ],
        },
      ],
    } as Awaited<ReturnType<typeof listShopProducts>> & { ok: true });

    await renderShopPage();

    expect(screen.getByRole('heading', { name: 'Shop' })).toBeInTheDocument();
    const productLinks = screen.getAllByRole('link', { name: /dragon mug/i });
    expect(productLinks.some((link) => link.getAttribute('href') === '/shop/dragon-mug')).toBe(true);
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('1 product')).toBeInTheDocument();
  });

  it('shows empty state when catalog has no products', async () => {
    mockListShopProducts.mockResolvedValue({
      ok: true,
      count: 0,
      regionId: 'reg_test',
      products: [],
    });

    await renderShopPage();

    expect(screen.getByText(/no products are available yet/i)).toBeInTheDocument();
  });
});
