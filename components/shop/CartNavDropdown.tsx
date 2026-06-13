'use client';

import type { ShopCartNavPreview } from '@/app/lib/medusa-cart';
import { formatMoney } from '@/app/lib/shop-pricing';
import { BoxIcon } from '@/components/icons/BoxIcon';
import { boxiconsCart, boxiconsCartFilled } from '@/components/icons/boxicons-shop';
import Image from 'next/image';
import Link from 'next/link';
import { CartQuantityControls } from './CartQuantityControls';
import { ShopNavDropdownPanel } from './ShopNavDropdownPanel';

type CartNavDropdownProps = {
  cart: ShopCartNavPreview;
};

export function CartNavDropdown({ cart }: CartNavDropdownProps) {
  const hasItems = cart.itemCount > 0;
  const ariaLabel = hasItems ? `Cart, ${cart.itemCount} items` : 'Cart';
  const formattedTotal =
    cart.total != null && cart.currencyCode
      ? formatMoney(cart.total, cart.currencyCode)
      : null;

  return (
    <div className="relative group">
      <Link
        href="/shop/cart"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-white hover:bg-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/50"
        aria-label={ariaLabel}
      >
        <BoxIcon
          icon={hasItems ? boxiconsCartFilled : boxiconsCart}
          width="1.5rem"
          height="1.5rem"
          className="text-(--hd-title-yellow) drop-shadow-[2px_2px_0_rgb(0_0_0)]"
        />
        {hasItems && (
          <span className="min-w-[1.25rem] rounded-full bg-(--hd-title-yellow) px-1.5 text-center text-xs font-body-bold text-black">
            {cart.itemCount}
          </span>
        )}
        <span className="text-xs opacity-80" aria-hidden>
          ▾
        </span>
      </Link>
      <ShopNavDropdownPanel
        seed="shop-cart-menu"
        className="right-0 w-[18rem]"
        contentClassName="relative z-10 max-h-[22rem] overflow-y-auto px-3 py-3"
      >
        {!hasItems ? (
          <div className="space-y-2">
            <p className="font-body-bold text-sm">Your cart is empty.</p>
            <Link href="/shop/cart" className="font-body-bold text-sm underline hover:text-(--hd-donut-pink)">
              View cart
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <ul className="space-y-3 list-none m-0 p-0">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-2">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-(--hd-dark-blue) bg-white/80">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="hd-body-text text-sm font-body-bold truncate">{item.title}</p>
                    {item.variantTitle && (
                      <p className="font-body-bold text-xs text-(--hd-gray-600)">{item.variantTitle}</p>
                    )}
                    {item.unitPrice && (
                      <p className="font-body-bold text-xs">{item.unitPrice}</p>
                    )}
                    <CartQuantityControls
                      lineItemId={item.id}
                      quantity={item.quantity}
                      compact
                    />
                  </div>
                </li>
              ))}
            </ul>
            {formattedTotal && (
              <p className="hd-body-text text-sm font-body-bold border-t border-(--hd-dark-blue)/30 pt-2">
                Total: {formattedTotal}
              </p>
            )}
            <div className="flex flex-col gap-1">
              <Link href="/shop/cart" className="font-body-bold text-sm underline hover:text-(--hd-donut-pink)">
                View cart
              </Link>
              <Link href="/shop/checkout" className="font-body-bold text-sm underline hover:text-(--hd-donut-pink)">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </ShopNavDropdownPanel>
    </div>
  );
}
