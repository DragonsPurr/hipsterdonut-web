'use client';

import { logoutAction } from '@/app/shop/actions';
import { BoxIcon } from '@/components/icons/BoxIcon';
import { boxiconsUserCircle, boxiconsUserCircleFilled } from '@/components/icons/boxicons-shop';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShopNavDropdownPanel } from './ShopNavDropdownPanel';

type AccountNavDropdownProps = {
  isCustomerLoggedIn?: boolean;
  customerDisplayName?: string | null;
  customerAvatarUrl?: string | null;
  customerInitials?: string | null;
};

function isAccountActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === '/shop/account' ||
    pathname === '/shop/orders' ||
    pathname === '/shop/login' ||
    pathname === '/shop/signup'
  );
}

export function AccountNavDropdown({
  isCustomerLoggedIn = false,
  customerDisplayName = null,
  customerAvatarUrl = null,
  customerInitials = null,
}: AccountNavDropdownProps) {
  const pathname = usePathname();
  const active = isAccountActive(pathname);

  return (
    <div className="relative group">
      <button
        type="button"
        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-white hover:bg-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/50 ${
          active ? 'bg-white/10' : ''
        }`}
        aria-label="Account menu"
        aria-haspopup="menu"
      >
        {customerAvatarUrl ? (
          <Image
            src={customerAvatarUrl}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full border border-white/50 object-cover"
          />
        ) : (
          <BoxIcon
            icon={isCustomerLoggedIn ? boxiconsUserCircleFilled : boxiconsUserCircle}
            width="1.5rem"
            height="1.5rem"
            className="text-(--hd-title-yellow) drop-shadow-[2px_2px_0_rgb(0_0_0)]"
          />
        )}
        <span className="text-xs opacity-80" aria-hidden>
          ▾
        </span>
      </button>
      <ShopNavDropdownPanel seed="shop-account-menu" className="right-0 min-w-[14rem]" role="menu">
        {isCustomerLoggedIn && (customerDisplayName || customerInitials) && (
          <div className="flex items-center gap-2 px-2 py-1 border-b border-(--hd-dark-blue)/40 mb-1">
            {customerAvatarUrl ? (
              <Image
                src={customerAvatarUrl}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-(--hd-dark-blue) object-cover"
              />
            ) : customerInitials ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--hd-dark-blue) text-white text-xs font-body-bold">
                {customerInitials}
              </span>
            ) : null}
            {customerDisplayName && (
              <p className="hd-body-text text-sm font-body-bold">{customerDisplayName}</p>
            )}
          </div>
        )}
        {!isCustomerLoggedIn && (
          <Link
            href="/shop/login"
            role="menuitem"
            className="block rounded px-2 py-1.5 font-body-bold text-sm hover:bg-(--hd-dark-blue)/20"
          >
            Login or create account
          </Link>
        )}
        <Link
          href="/shop/orders"
          role="menuitem"
          className="block rounded px-2 py-1.5 font-body-bold text-sm hover:bg-(--hd-dark-blue)/20"
        >
          Order history
        </Link>
        <Link
          href="/shop/account"
          role="menuitem"
          className="block rounded px-2 py-1.5 font-body-bold text-sm hover:bg-(--hd-dark-blue)/20"
        >
          Manage account
        </Link>
        {isCustomerLoggedIn && (
          <form action={logoutAction} className="mt-1 border-t border-(--hd-dark-blue)/30 pt-1">
            <button
              type="submit"
              role="menuitem"
              className="block w-full rounded px-2 py-1.5 text-left font-body-bold text-sm hover:bg-(--hd-dark-blue)/20"
            >
              Log out
            </button>
          </form>
        )}
      </ShopNavDropdownPanel>
    </div>
  );
}
