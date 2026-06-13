import type { HttpTypes } from '@medusajs/types';
import { ProductCard } from './ProductCard';

type ShopProductGridProps = {
  products: HttpTypes.StoreProduct[];
  count: number;
};

export function ShopProductGrid({ products, count }: ShopProductGridProps) {
  return (
    <>
      <p className="hd-body-text text-lg mb-6">
        {count} {count === 1 ? 'product' : 'products'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 min-w-0">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
