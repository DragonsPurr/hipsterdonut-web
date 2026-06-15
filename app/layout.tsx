import Script from 'next/script';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { LayoutSwitcher } from './LayoutSwitcher';
import { SiteDonutBgTileCache } from '@/components/SiteDonutBgTileCache';
import { logoTypes, siteAssets, siteInfo } from './lib/constants';
import {
  getCustomerDisplayName,
  getCustomerInitials,
  getLoggedInCustomerAvatarUrl,
  retrieveLoggedInCustomer,
} from './lib/medusa-auth';
import { getShopCartNavPreview } from './lib/medusa-cart';
import { listShopCategories } from './lib/shop';
import './globals.css';
import type { CSSProperties, ReactNode } from 'react';

export const viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: siteInfo.name,
    template: `%s | ${siteInfo.name}`,
  },
  description: siteInfo.description,
  openGraph: {
    type: 'website',
    siteName: siteInfo.name,
    title: siteInfo.name,
    description: siteInfo.description,
    images: [
      {
        url: logoTypes.wide_orig_colour,
        alt: siteInfo.name,
      },
    ],
  },
  icons: {
    icon: logoTypes.favicon,
    apple: logoTypes.favicon,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [shopCategories, cart, customer] = await Promise.all([
    listShopCategories(),
    getShopCartNavPreview(),
    retrieveLoggedInCustomer(),
  ]);

  const customerDisplayName = getCustomerDisplayName(customer);
  const customerAvatarUrl = getLoggedInCustomerAvatarUrl(customer);
  const customerInitials = getCustomerInitials(customer);

  return (
    <html
      lang="en"
      className="font-sans"
      style={
        {
          '--hd-donut-bg-tile': `url('${siteAssets.donutBgTile}')`,
        } as CSSProperties
      }
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/lzy8dag.css"></link>
        <link rel="preload" as="image" href={siteAssets.donutBgTile} />
      </head>
      <body className="text-black min-h-screen flex flex-col">
        <SiteDonutBgTileCache assetUrl={siteAssets.donutBgTile} />
        <Script id="gtag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
          `}
        </Script>
        <LayoutSwitcher
          shopCategories={shopCategories}
          cart={cart}
          isCustomerLoggedIn={Boolean(customer)}
          customerDisplayName={customerDisplayName}
          customerAvatarUrl={customerAvatarUrl}
          customerInitials={customerInitials}
        >
          {children}
        </LayoutSwitcher>
        <Analytics />
      </body>
    </html>
  );
}
