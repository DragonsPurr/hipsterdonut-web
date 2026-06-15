'use client';

import { useEffect } from 'react';
import { applySiteAssetBrowserCache } from '@/app/lib/site-assets';

export function SiteDonutBgTileCache({ assetUrl }: { assetUrl: string }) {
  useEffect(() => {
    void applySiteAssetBrowserCache(assetUrl);
  }, [assetUrl]);

  return null;
}
