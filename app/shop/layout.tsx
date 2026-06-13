export const dynamic = 'force-dynamic';

import type { ReactNode } from 'react';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <div className="[&_.hd-body-text]:font-body-bold">{children}</div>;
}
