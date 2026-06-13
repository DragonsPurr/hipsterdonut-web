import { getOvhSiteAsset } from '@/app/lib/ovh-site-assets';
import { isOvhSiteAssetsConfigured } from '@/app/lib/ovh-s3';
import {
  isAllowedSiteAssetObjectKey,
  SITE_ASSET_HTTP_CACHE_CONTROL,
} from '@/app/lib/site-assets';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ objectKey: string[] }> }
) {
  if (!isOvhSiteAssetsConfigured()) {
    return new Response('Not configured', { status: 503 });
  }

  const { objectKey: segments } = await params;
  const objectKey = segments.map(decodeURIComponent).join('/');

  if (!isAllowedSiteAssetObjectKey(objectKey)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const asset = await getOvhSiteAsset(objectKey);
    return new Response(Buffer.from(asset.body), {
      headers: {
        'Content-Type': asset.contentType,
        'Cache-Control': SITE_ASSET_HTTP_CACHE_CONTROL,
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
