import Medusa, { FetchError } from '@medusajs/js-sdk';

const CF_HEADERS = ['cf-connecting-ip', 'cf-ipcountry', 'cf-visitor', 'cf-ray'] as const;

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

const MEDUSA_BACKEND_URL =
  readEnv('MEDUSA_BACKEND_URL', 'NEXT_PUBLIC_MEDUSA_BACKEND_URL') ?? 'http://localhost:9000';

export const medusaPublishableKey = readEnv(
  'MEDUSA_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY'
);

export const medusaBackendUrl = MEDUSA_BACKEND_URL;

function toClientHeaders(headers: HeadersInit | undefined): Record<string, string> | undefined {
  if (!headers) return undefined;

  const next = new Headers(headers);
  for (const name of CF_HEADERS) {
    next.delete(name);
  }

  const out: Record<string, string> = {};
  next.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: medusaPublishableKey,
  auth: { type: 'jwt', jwtTokenStorageMethod: 'memory' },
});

const medusaClientFetch = sdk.client.fetch.bind(sdk.client);

sdk.client.fetch = ((input, init) =>
  medusaClientFetch(input, {
    ...init,
    cache: 'no-store',
    headers: toClientHeaders(init?.headers as HeadersInit | undefined) ?? init?.headers,
  })) as typeof sdk.client.fetch;

export function isMedusaConfigured(): boolean {
  return Boolean(medusaPublishableKey);
}

export function formatMedusaError(err: unknown, fallback: string): string {
  if (err instanceof FetchError) {
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
