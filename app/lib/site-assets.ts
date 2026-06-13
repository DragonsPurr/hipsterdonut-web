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

/** Inline head script: apply a cached blob URL immediately, then warm Cache Storage. */
export function buildSiteAssetBrowserCacheBootstrapScript(assetUrl: string): string {
  return `(function(){try{var url=${JSON.stringify(assetUrl)};var cacheName=${JSON.stringify(SITE_ASSETS_BROWSER_CACHE_NAME)};if(!('caches' in window))return;caches.open(cacheName).then(function(cache){return cache.match(url).then(function(cached){if(cached){return cached.blob().then(function(blob){document.documentElement.style.setProperty('--hd-donut-bg-tile',"url('"+URL.createObjectURL(blob)+"')");});}return fetch(url,{credentials:'same-origin'}).then(function(res){if(res.ok)return cache.put(url,res.clone());});});});}catch(e){}})();`;
}

export function isAllowedSiteAssetObjectKey(key: string): boolean {
  if (!key || key.includes('..') || key.startsWith('/')) {
    return false;
  }

  const brandPattern = /^brand\/[a-zA-Z0-9._-]+$/;
  const rootPattern = /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|gif|svg)$/;

  return brandPattern.test(key) || rootPattern.test(key);
}
