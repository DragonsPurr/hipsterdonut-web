'use client';

import type { ShopCartNavPreview } from '@/app/lib/medusa-cart';
import type { ShopCategoryNavItem } from '@/app/lib/shop';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ShopSubNav } from '@/components/shop/ShopSubNav';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type LayoutSwitcherProps = {
  children: ReactNode;
  shopCategories?: ShopCategoryNavItem[];
  cart?: ShopCartNavPreview;
  isCustomerLoggedIn?: boolean;
  customerDisplayName?: string | null;
  customerAvatarUrl?: string | null;
  customerInitials?: string | null;
};

export function LayoutSwitcher({
  children,
  shopCategories = [],
  cart,
  isCustomerLoggedIn = false,
  customerDisplayName = null,
  customerAvatarUrl = null,
  customerInitials = null,
}: LayoutSwitcherProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');
  const isShop = pathname?.startsWith('/shop');

  if (isStudio) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <>
      <header className="hd-site-header">
        <Navigation embedded={isShop} />
        {isShop && (
          <ShopSubNav
            categories={shopCategories}
            cart={cart}
            isCustomerLoggedIn={isCustomerLoggedIn}
            customerDisplayName={customerDisplayName}
            customerAvatarUrl={customerAvatarUrl}
            customerInitials={customerInitials}
          />
        )}
      </header>
      <main className="hd-main-content">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </main>
      <Footer />
    </>
  );
}
