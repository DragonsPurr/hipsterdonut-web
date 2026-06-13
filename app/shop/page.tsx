import { listShopProducts } from '@/app/lib/shop';
import { PageTitle } from '@/components/PageTitle';
import { ShopErrorAlert } from '@/components/shop/ShopErrorAlert';
import { ShopProductGrid } from '@/components/shop/ShopProductGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse products from Hipster Donut.',
};

export default async function ShopPage() {
  const result = await listShopProducts();

  return (
    <div className="w-full">
      <header className="mb-8 md:mb-12">
        <PageTitle text="Shop" seed="shop" className="mb-4 md:mb-6" />
        <p className="hd-body-text max-w-3xl">
          Browse our latest products. Prices are shown for your region when available.
        </p>
      </header>

      {!result.ok ? (
        <ShopErrorAlert message={result.error} />
      ) : result.products.length === 0 ? (
        <p className="hd-body-text">No products are available yet. Add products in Medusa Admin.</p>
      ) : (
        <ShopProductGrid products={result.products} count={result.count} />
      )}
    </div>
  );
}
