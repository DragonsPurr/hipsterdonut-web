'use client';

import { MidCenturyAbstractShapeBackdrop } from '@/components/MidCenturyAbstractTitle';
import Link from 'next/link';

function shapeBackdropClass(active: boolean): string {
  if (active) {
    return 'opacity-100';
  }

  return 'opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100';
}

export type NavItemLinkProps = {
  href: string;
  label: string;
  active: boolean;
  className?: string;
  onClick?: () => void;
};

function navShapeSeed(href: string): string {
  if (href === '/') return 'nav-home';
  return `nav-${href.slice(1).replace(/\//g, '-')}`;
}

export function NavItemLink({ href, label, active, className = '', onClick }: NavItemLinkProps) {
  const linkClass = active
    ? `hd-nav-item-link hd-nav-item-active ${className}`.trim()
    : `hd-nav-item-link ${className}`.trim();

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center overflow-visible px-2 py-0.5 md:px-3 md:py-1 ${linkClass}`}
    >
      <MidCenturyAbstractShapeBackdrop
        seed={navShapeSeed(href)}
        context="nav"
        className={shapeBackdropClass(active)}
      />
      <span className="relative">{label}</span>
    </Link>
  );
}
