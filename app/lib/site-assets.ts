export const SITE_ASSETS_PROXY_BASE = '/api/assets';

/** Cache Storage bucket for same-origin site asset blobs (survives reloads). */
export const SITE_ASSETS_BROWSER_CACHE_NAME = 'hd-site-assets-v1';

/** Long-lived cache for immutable brand assets (browser + CDN). */
export const SITE_ASSET_HTTP_CACHE_CONTROL =
  'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable';

const DEFAULT_PUBLIC_BASE =
  'https://dp-hd-assets.s3.ca-east-tor.io.cloud.ovh.net';

export function getSiteAssetsPublicBaseUrl(): string {
  const url = process.env.OVH_SITE_ASSETS_PUBLIC_URL?.trim() || DEFAULT_PUBLIC_BASE;
  return url.replace(/\/$/, '');
}

export function buildSiteAssetUrl(objectKey: string): string {
  const encoded = objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${SITE_ASSETS_PROXY_BASE}/${encoded}`;
}

/** After hydration: use a cached blob for the bg tile when available, else warm Cache Storage. */
export async function applySiteAssetBrowserCache(assetUrl: string): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cache = await caches.open(SITE_ASSETS_BROWSER_CACHE_NAME);
    const cached = await cache.match(assetUrl);

    if (cached) {
      const blob = await cached.blob();
      document.documentElement.style.setProperty(
        '--hd-donut-bg-tile',
        `url('${URL.createObjectURL(blob)}')`,
      );
      return;
    }

    const res = await fetch(assetUrl, { credentials: 'same-origin' });
    if (res.ok) {
      await cache.put(assetUrl, res.clone());
    }
  } catch {
    // Cache Storage is best-effort; keep the server-provided asset URL.
  }
}

export function isAllowedSiteAssetObjectKey(key: string): boolean {
  if (!key || key.includes('..') || key.startsWith('/')) {
    return false;
  }

  const brandPattern = /^brand\/[a-zA-Z0-9._-]+$/;
  const rootPattern = /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|gif|svg)$/;

  return brandPattern.test(key) || rootPattern.test(key);
}
