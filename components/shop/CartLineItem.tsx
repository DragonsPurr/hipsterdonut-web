import type { HttpTypes } from '@medusajs/types';
import { formatVariantPrice } from '@/app/lib/shop-pricing';
import Image from 'next/image';
import Link from 'next/link';
import { CartQuantityControls } from './CartQuantityControls';

type CartLineItemProps = {
  item: HttpTypes.StoreCartLineItem;
  productHandle?: string | null;
};

export function CartLineItem({ item, productHandle }: CartLineItemProps) {
  const unitPrice = formatVariantPrice(item.variant?.calculated_price);
  const title = item.product_title ?? item.title ?? 'Item';
  const href = productHandle ? `/shop/${productHandle}` : null;

  return (
    <li className="flex gap-4 border-b border-(--hd-dark-blue)/30 py-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 border-(--hd-dark-blue) bg-white/80">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={title}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center hd-body-text text-xs text-(--hd-gray-600)">
            No image
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          {href ? (
            <Link href={href} className="font-title text-lg hover:text-(--hd-brand-pink)">
              {title}
            </Link>
          ) : (
            <p className="font-title text-lg">{title}</p>
          )}
          {item.variant_title && item.variant_title !== 'Default Variant' && (
            <p className="hd-body-text text-sm text-(--hd-gray-600)">{item.variant_title}</p>
          )}
          {unitPrice && <p className="hd-body-text text-sm">{unitPrice}</p>}
        </div>
        <CartQuantityControls lineItemId={item.id} quantity={item.quantity} />
      </div>
    </li>
  );
}
