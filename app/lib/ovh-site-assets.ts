import { GetObjectCommand } from '@aws-sdk/client-s3';
import {
  createOvhS3Client,
  getOvhSiteAssetsBucket,
  isOvhSiteAssetsConfigured,
} from './ovh-s3';
import { isAllowedSiteAssetObjectKey } from './site-assets';

export { isOvhSiteAssetsConfigured };

export async function getOvhSiteAsset(
  objectKey: string
): Promise<{ body: Uint8Array; contentType: string }> {
  if (!isOvhSiteAssetsConfigured()) {
    throw new Error('OVH site assets bucket is not configured');
  }
  if (!isAllowedSiteAssetObjectKey(objectKey)) {
    throw new Error('Invalid site asset object key');
  }

  const client = createOvhS3Client();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: getOvhSiteAssetsBucket(),
      Key: objectKey,
    })
  );

  const body = await response.Body?.transformToByteArray();
  if (!body) {
    throw new Error('Empty object body');
  }

  return {
    body,
    contentType: response.ContentType ?? 'application/octet-stream',
  };
}
