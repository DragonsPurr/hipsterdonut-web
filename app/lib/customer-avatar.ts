import { isOvhUserAssetsConfigured } from './ovh-s3';

export { isOvhUserAssetsConfigured };

const DEFAULT_PUBLIC_BASE =
  'https://hipsterdonut-user-assets.s3.ca-east-tor.io.cloud.ovh.net';

const AVATAR_PROXY_BASE = '/api/shop/avatar';

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

const AVATAR_MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function getAvatarPublicBaseUrl(): string {
  const url = process.env.OVH_USER_ASSETS_PUBLIC_URL?.trim() || DEFAULT_PUBLIC_BASE;
  return url.replace(/\/$/, '');
}

export function getAvatarExtensionForMime(contentType: string): string | null {
  return AVATAR_MIME_TO_EXTENSION[contentType] ?? null;
}

export function buildCustomerAvatarObjectKey(customerId: string, extension: string): string {
  const sanitizedId = customerId.replace(/[^a-zA-Z0-9_-]/g, '');
  const timestamp = Date.now();
  return `avatars/${sanitizedId}/${timestamp}.${extension}`;
}

export function buildPublicObjectUrl(objectKey: string): string {
  const base = getAvatarPublicBaseUrl();
  const encodedPath = objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${base}/${encodedPath}`;
}

export function isAllowedAvatarObjectKey(key: string): boolean {
  return /^avatars\/[a-zA-Z0-9_-]+\/[0-9]+\.(jpg|jpeg|png|webp|gif)$/.test(key);
}

export function isAllowedAvatarUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    const base = new URL(getAvatarPublicBaseUrl());
    if (parsed.origin !== base.origin) {
      return false;
    }
    return parsed.pathname.startsWith('/avatars/');
  } catch {
    return false;
  }
}

export type CustomerWithAvatar = {
  metadata?: {
    avatar_url?: string;
  } | null;
};

export function getCustomerAvatarProxyUrl(customer: CustomerWithAvatar): string | null {
  const avatarUrl = customer.metadata?.avatar_url;
  if (!avatarUrl || !isAllowedAvatarUrl(avatarUrl)) {
    return null;
  }

  const parsed = new URL(avatarUrl);
  const objectKey = decodeURIComponent(parsed.pathname.slice(1));
  if (!isAllowedAvatarObjectKey(objectKey)) {
    return null;
  }

  const encoded = objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${AVATAR_PROXY_BASE}/${encoded}`;
}
