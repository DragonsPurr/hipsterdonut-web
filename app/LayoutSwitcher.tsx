'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type LayoutSwitcherProps = {
  children: ReactNode;
};

export function LayoutSwitcher({ children }: LayoutSwitcherProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  if (isStudio) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="hd-main-content">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </main>
      <Footer />
    </>
  );
}
