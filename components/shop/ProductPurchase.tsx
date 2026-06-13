'use client';

import type { HttpTypes } from '@medusajs/types';
import { useMemo, useState } from 'react';
import { formatVariantPrice } from '@/app/lib/shop-pricing';
import { AddToCartButton } from './AddToCartButton';

type ProductPurchaseProps = {
  product: HttpTypes.StoreProduct;
};

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? '');

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId]
  );

  const selectedPrice = formatVariantPrice(selectedVariant?.calculated_price);
  const hasMultipleVariants = variants.length > 1;

  if (variants.length === 0) {
    return <p className="hd-body-text text-(--hd-gray-600)">This product is not available for purchase.</p>;
  }

  return (
    <div className="space-y-4 border-t-2 border-(--hd-dark-blue)/30 pt-4">
      {hasMultipleVariants && (
        <div className="space-y-2">
          <label htmlFor="variant-select" className="hd-body-text font-body-bold text-sm">
            Option
          </label>
          <select
            id="variant-select"
            value={selectedVariantId}
            onChange={(event) => setSelectedVariantId(event.target.value)}
            className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
          >
            {variants.map((variant) => {
              const label =
                variant.title && variant.title !== 'Default Variant'
                  ? variant.title
                  : product.title;
              const price = formatVariantPrice(variant.calculated_price);
              return (
                <option key={variant.id} value={variant.id}>
                  {label}
                  {price ? ` — ${price}` : ''}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {selectedPrice && !hasMultipleVariants && (
        <p className="font-body-bold text-2xl">{selectedPrice}</p>
      )}

      <AddToCartButton variantId={selectedVariant?.id ?? ''} />
    </div>
  );
}
