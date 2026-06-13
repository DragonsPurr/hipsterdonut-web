import { formatMedusaError, isMedusaConfigured, sdk } from './medusa';

export async function getDefaultRegionId(): Promise<string | null> {
  if (!isMedusaConfigured()) return null;

  try {
    const { regions } = await sdk.store.region.list({ limit: 1 });
    return regions[0]?.id ?? null;
  } catch (err) {
    console.error('Failed to load Medusa regions:', formatMedusaError(err, 'Unknown error'));
    return null;
  }
}
