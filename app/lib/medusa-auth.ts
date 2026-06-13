import { cookies } from 'next/headers';
import { getCustomerAvatarProxyUrl, type CustomerWithAvatar } from './customer-avatar';
import { formatMedusaError, isMedusaConfigured, sdk } from './medusa';

export const MEDUSA_JWT_COOKIE = '_medusa_jwt';

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export type LoggedInCustomer = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  metadata?: CustomerWithAvatar['metadata'];
};

export async function getMedusaAuthToken(): Promise<string | undefined> {
  return (await cookies()).get(MEDUSA_JWT_COOKIE)?.value;
}

export async function applyMedusaAuthFromCookie(): Promise<boolean> {
  const token = await getMedusaAuthToken();
  if (!token) return false;
  await sdk.client.setToken(token);
  return true;
}

export async function setMedusaAuthCookie(token: string): Promise<void> {
  (await cookies()).set(MEDUSA_JWT_COOKIE, token, AUTH_COOKIE_OPTIONS);
}

export async function clearMedusaAuthCookie(): Promise<void> {
  (await cookies()).delete(MEDUSA_JWT_COOKIE);
}

export async function retrieveLoggedInCustomer(): Promise<LoggedInCustomer | null> {
  if (!isMedusaConfigured()) return null;
  if (!(await applyMedusaAuthFromCookie())) return null;

  try {
    const { customer } = await sdk.store.customer.retrieve();
    if (!customer?.id) return null;

    return {
      id: customer.id,
      email: customer.email ?? '',
      firstName: customer.first_name ?? null,
      lastName: customer.last_name ?? null,
      metadata: customer.metadata ?? null,
    };
  } catch (err) {
    const message = formatMedusaError(err, '');
    if (
      message.toLowerCase().includes('unauthorized') ||
      message.toLowerCase().includes('not found') ||
      message.toLowerCase().includes('unauthenticated')
    ) {
      return null;
    }
    console.error('Failed to load customer:', message);
    return null;
  }
}

export function getCustomerDisplayName(customer: LoggedInCustomer | null): string | null {
  if (!customer) return null;

  const parts = [customer.firstName, customer.lastName].filter(Boolean);
  if (parts.length > 0) return parts.join(' ');

  return customer.email || null;
}

export function getCustomerInitials(customer: LoggedInCustomer | null): string | null {
  const displayName = getCustomerDisplayName(customer);
  if (!displayName) return null;

  const words = displayName.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? '').join('') || null;
}

export function getLoggedInCustomerAvatarUrl(customer: LoggedInCustomer | null): string | null {
  if (!customer) return null;
  return getCustomerAvatarProxyUrl(customer);
}
