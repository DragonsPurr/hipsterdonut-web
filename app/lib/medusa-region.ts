import { formatMedusaError, isMedusaConfigured, sdk } from './medusa';

function readDefaultRegionIdFromEnv(): string | undefined {
  const value = process.env.MEDUSA_DEFAULT_REGION_ID?.trim();
  return value || undefined;
}

export async function getDefaultRegionId(): Promise<string | null> {
  if (!isMedusaConfigured()) return null;

  const configuredRegionId = readDefaultRegionIdFromEnv();
  if (configuredRegionId) {
    return configuredRegionId;
  }

  try {
    const { regions } = await sdk.store.region.list({ limit: 1 });
    return regions[0]?.id ?? null;
  } catch (err) {
    console.error('Failed to load Medusa regions:', formatMedusaError(err, 'Unknown error'));
    return null;
  }
}
