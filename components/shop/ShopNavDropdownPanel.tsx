'use client';

import { MidCenturySectionBackground } from '@/components/MidCenturySectionBackground';
import type { ReactNode } from 'react';

export type ShopNavDropdownPanelProps = {
  seed: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  role?: string;
};

const DEFAULT_DROPDOWN_CONTENT_CLASS = 'relative z-10 px-2 py-2';

export function ShopNavDropdownPanel({
  seed,
  children,
  className = '',
  contentClassName = DEFAULT_DROPDOWN_CONTENT_CLASS,
  role,
}: ShopNavDropdownPanelProps) {
  return (
    <div
      role={role}
      className={`absolute top-full z-50 mt-1 hidden min-w-[12rem] group-hover:block group-focus-within:block ${className}`.trim()}
    >
      <MidCenturySectionBackground
        seed={seed}
        className="mt-0 w-auto"
        contentClassName={contentClassName}
      >
        {children}
      </MidCenturySectionBackground>
    </div>
  );
}
