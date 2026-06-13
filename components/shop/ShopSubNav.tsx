'use client';

import type { ShopCartNavPreview } from '@/app/lib/medusa-cart';
import type { ShopCategoryNavItem } from '@/app/lib/shop';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccountNavDropdown } from './AccountNavDropdown';
import { CartNavDropdown } from './CartNavDropdown';
import { ShopNavDropdownPanel } from './ShopNavDropdownPanel';

export type ShopSubNavProps = {
  categories?: ShopCategoryNavItem[];
  cart?: ShopCartNavPreview;
  isCustomerLoggedIn?: boolean;
  customerDisplayName?: string | null;
  customerAvatarUrl?: string | null;
  customerInitials?: string | null;
};

export function ShopSubNav({
  categories = [],
  cart = { itemCount: 0, items: [], total: null, currencyCode: null },
  isCustomerLoggedIn = false,
  customerDisplayName = null,
  customerAvatarUrl = null,
  customerInitials = null,
}: ShopSubNavProps) {
  const pathname = usePathname();
  const browseActive =
    pathname === '/shop' || (pathname?.startsWith('/shop/category/') ?? false);

  return (
    <nav
      aria-label="Shop"
      className="w-full flex justify-center bg-(--hd-dark-blue) border-b-2 border-(--hd-dark-blue)"
    >
      <ul className="w-full max-w-7xl flex flex-wrap items-center gap-6 md:gap-10 py-2.5 px-3 md:px-0 list-none m-0">
        <li className="relative group">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 font-title font-bold text-lg text-(--hd-title-yellow) drop-shadow-[2px_2px_0_rgb(0_0_0)] [text-shadow:1px_1px_0_rgb(0_0_0)] hover:text-(--hd-light-blue) md:text-xl"
            aria-current={browseActive ? 'page' : undefined}
          >
            Browse
            <span className="text-sm opacity-80" aria-hidden>
              ▾
            </span>
          </Link>
          <ShopNavDropdownPanel seed="shop-browse-menu" className="left-0">
            <Link
              href="/shop"
              className="block px-2 py-1.5 font-body-bold text-sm hover:bg-(--hd-dark-blue)/20"
            >
              All products
            </Link>
            {categories.length === 0 ? (
              <p className="px-2 py-1.5 font-body-bold text-sm text-(--hd-gray-600)">No categories yet</p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/category/${category.handle}`}
                  className="block px-2 py-1.5 font-body-bold text-sm hover:bg-(--hd-dark-blue)/20"
                >
                  {category.name}
                </Link>
              ))
            )}
          </ShopNavDropdownPanel>
        </li>
        <li className="ml-auto flex items-center gap-2 md:gap-3">
          <AccountNavDropdown
            isCustomerLoggedIn={isCustomerLoggedIn}
            customerDisplayName={customerDisplayName}
            customerAvatarUrl={customerAvatarUrl}
            customerInitials={customerInitials}
          />
          <CartNavDropdown cart={cart} />
        </li>
      </ul>
    </nav>
  );
}
