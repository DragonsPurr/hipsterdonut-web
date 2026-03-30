import Script from 'next/script';
import { LayoutSwitcher } from './LayoutSwitcher';
import { logoTypes, siteInfo } from './lib/constants';
import './globals.css';
import './styles/sweetalert2-overrides.scss';
import type { ReactNode } from 'react';

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <head>
      <link rel="stylesheet" href="https://use.typekit.net/lzy8dag.css"></link>
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
        <LayoutSwitcher>{children}</LayoutSwitcher>
      </body>
    </html>
  );
}
