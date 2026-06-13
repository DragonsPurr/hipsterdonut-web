import { getOvhUserAsset } from '@/app/lib/ovh-user-assets';
import { isOvhUserAssetsConfigured } from '@/app/lib/ovh-s3';
import { isAllowedAvatarObjectKey } from '@/app/lib/customer-avatar';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ objectKey: string[] }> }
) {
  if (!isOvhUserAssetsConfigured()) {
    return new Response('Not configured', { status: 503 });
  }

  const { objectKey: segments } = await params;
  const objectKey = segments.map(decodeURIComponent).join('/');

  if (!isAllowedAvatarObjectKey(objectKey)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const asset = await getOvhUserAsset(objectKey);
    return new Response(Buffer.from(asset.body), {
      headers: {
        'Content-Type': asset.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
