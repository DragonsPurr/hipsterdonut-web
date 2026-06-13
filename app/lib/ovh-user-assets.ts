import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  buildCustomerAvatarObjectKey,
  buildPublicObjectUrl,
  getAvatarExtensionForMime,
  isAllowedAvatarObjectKey,
} from './customer-avatar';
import {
  createOvhS3Client,
  getOvhUserAssetsBucket,
  isOvhUserAssetsConfigured,
} from './ovh-s3';

export { isOvhUserAssetsConfigured };

export async function uploadCustomerAvatarToOvh(
  customerId: string,
  body: Uint8Array,
  contentType: string
): Promise<string> {
  if (!isOvhUserAssetsConfigured()) {
    throw new Error('OVH user assets bucket is not configured');
  }

  const extension = getAvatarExtensionForMime(contentType);
  if (!extension) {
    throw new Error('Unsupported avatar content type');
  }

  const objectKey = buildCustomerAvatarObjectKey(customerId, extension);
  const bucket = getOvhUserAssetsBucket();
  const client = createOvhS3Client();

  const putParams = {
    Bucket: bucket,
    Key: objectKey,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  };

  try {
    await client.send(
      new PutObjectCommand({
        ...putParams,
        ACL: 'public-read',
      })
    );
  } catch {
    await client.send(new PutObjectCommand(putParams));
  }

  return buildPublicObjectUrl(objectKey);
}

export async function getOvhUserAsset(
  objectKey: string
): Promise<{ body: Uint8Array; contentType: string }> {
  if (!isOvhUserAssetsConfigured()) {
    throw new Error('OVH user assets bucket is not configured');
  }
  if (!isAllowedAvatarObjectKey(objectKey)) {
    throw new Error('Invalid avatar object key');
  }

  const client = createOvhS3Client();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: getOvhUserAssetsBucket(),
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
