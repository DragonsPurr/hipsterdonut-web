import { S3Client } from '@aws-sdk/client-s3';

const DEFAULT_REGION = 'ca-east-tor';

export function getOvhS3Credentials() {
  return {
    endpoint: process.env.OVH_S3_ENDPOINT?.trim() ?? '',
    region: process.env.OVH_S3_REGION?.trim() || DEFAULT_REGION,
    accessKeyId: process.env.OVH_S3_ACCESS_KEY?.trim() ?? '',
    secretAccessKey: process.env.OVH_S3_SECRET_KEY?.trim() ?? '',
  };
}

export function isOvhS3Configured(): boolean {
  const { endpoint, accessKeyId, secretAccessKey } = getOvhS3Credentials();
  return Boolean(endpoint && accessKeyId && secretAccessKey);
}

export function getOvhUserAssetsBucket(): string {
  return process.env.OVH_USER_ASSETS_S3_BUCKET?.trim() ?? '';
}

export function getOvhSiteAssetsBucket(): string {
  return process.env.OVH_SITE_ASSETS_S3_BUCKET?.trim() ?? '';
}

export function isOvhUserAssetsConfigured(): boolean {
  return isOvhS3Configured() && Boolean(getOvhUserAssetsBucket());
}

export function isOvhSiteAssetsConfigured(): boolean {
  return isOvhS3Configured() && Boolean(getOvhSiteAssetsBucket());
}

export function createOvhS3Client(): S3Client {
  const { endpoint, region, accessKeyId, secretAccessKey } = getOvhS3Credentials();
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('OVH S3 credentials are not configured');
  }
  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });
}
