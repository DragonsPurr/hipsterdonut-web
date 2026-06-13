'use client';

import { externalLinkAttributes, logoTypes } from '@/app/lib/constants';
import { NavItemLink } from '@/components/NavItemLink';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
  { href: '/shop', label: 'Shop' },
];

type NavigationProps = {
  /** When true, nav sits inside the sticky header wrapper (e.g. shop sub-nav below). */
  embedded?: boolean;
};

export function Navigation({ embedded = false }: NavigationProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }

    if (typeof mq.addListener === 'function' && typeof mq.removeListener === 'function') {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const isActive = (href: string) => {
    if (pathname == null) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navLinkSize = 'text-lg md:text-2xl';

  const renderNavLink = (
    href: string,
    label: string,
    options?: { onClick?: () => void; className?: string },
  ) => (
    <NavItemLink
      key={href}
      href={href}
      label={label}
      active={isActive(href)}
      className={[navLinkSize, options?.className].filter(Boolean).join(' ')}
      onClick={options?.onClick}
    />
  );

  const navLinksContent = <>{navLinks.map(({ href, label }) => renderNavLink(href, label))}</>;

  return (
    <nav className={`hd-nav-bar${embedded ? ' hd-nav-bar-embedded' : ''}`}>
      <div className="w-full max-w-7xl flex items-center justify-between gap-3 md:gap-6">
        <div className="flex flex-row items-center gap-3 md:gap-4 min-w-0">
          <Link href="/" className="ml-3 md:ml-12 flex shrink-0 items-center">
            <Image
              src={logoTypes.wide_orig_colour}
              alt="Hipster Donut Apparel logo"
              className="hd-nav-logo drop-shadow-[2px_2px_0_rgb(0_0_0)]"
              width={400}
              height={400}
              priority
            />
          </Link>
          <span className="hidden lg:inline text-sm font-body font-bold leading-tight">
            a{' '}
            <a href="https://dragonspurr.ca" className="hd-link text-red-800" {...externalLinkAttributes}>
              Dragon&apos;s Purr
            </a>{' '}
            Brand
          </span>
        </div>

        {!isMobile && <div className="hd-nav-items">{navLinksContent}</div>}

        {isMobile && (
          <div className="relative">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center justify-center w-10 h-10 p-0 rounded-sm border border-(--hd-dark-blue) hover:bg-(--hd-dark-blue)/20 focus:outline-hidden focus:ring-2 focus:ring-(--hd-dark-blue) shrink-0"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden className="flex flex-col justify-between w-6 h-5 leading-none">
                <span className="block w-full h-0.5 bg-black flex-none" />
                <span className="block w-full h-0.5 bg-black flex-none" />
                <span className="block w-full h-0.5 bg-black flex-none" />
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-max max-w-[80vw] rounded-lg border-2 border-(--hd-dark-blue) bg-(--hd-alt-green) px-4 py-3 flex flex-col gap-3 text-left shadow-lg">
                <div className="flex flex-col gap-3 items-start">
                  {navLinks.map(({ href, label }) =>
                    renderNavLink(href, label, {
                      onClick: () => setMenuOpen(false),
                      className: 'self-start whitespace-nowrap',
                    }),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
