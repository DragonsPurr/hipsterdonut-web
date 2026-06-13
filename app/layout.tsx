import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { LayoutSwitcher } from './LayoutSwitcher';
import { logoTypes, siteAssets, siteInfo } from './lib/constants';
import { buildSiteAssetBrowserCacheBootstrapScript } from './lib/site-assets';
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

export const metadata = {
  title: siteInfo.name,
  description: siteInfo.description,
  openGraph: {
    url: siteInfo.url,
  },
  icons: {
    icon: logoTypes.favicon,
    apple: logoTypes.favicon,
  },
};

export const UmamiAnalytics = () => {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) {
    return <></>;
  }
  return (
    <>
      <Script async src="https://umami.is/script.js" data-website-id={websiteId} />
    </>
  );
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
        <script
          dangerouslySetInnerHTML={{
            __html: buildSiteAssetBrowserCacheBootstrapScript(siteAssets.donutBgTile),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
            `,
          }}
        />
      </head>
      <body className="text-black min-h-screen flex flex-col">
        <UmamiAnalytics />
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
