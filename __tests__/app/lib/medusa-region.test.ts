jest.mock('@/app/lib/medusa', () => ({
  isMedusaConfigured: jest.fn(),
  sdk: {
    store: {
      region: {
        list: jest.fn(),
      },
    },
  },
  formatMedusaError: jest.fn((_err: unknown, fallback: string) => fallback),
}));

import { getDefaultRegionId } from '@/app/lib/medusa-region';
import { isMedusaConfigured, sdk } from '@/app/lib/medusa';

describe('getDefaultRegionId', () => {
  const originalEnv = process.env;
  const mockIsMedusaConfigured = isMedusaConfigured as jest.MockedFunction<
    typeof isMedusaConfigured
  >;
  const mockRegionList = sdk.store.region.list as jest.MockedFunction<
    typeof sdk.store.region.list
  >;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.MEDUSA_DEFAULT_REGION_ID;
    jest.clearAllMocks();
    mockIsMedusaConfigured.mockReturnValue(true);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns null when Medusa is not configured', async () => {
    mockIsMedusaConfigured.mockReturnValue(false);

    expect(await getDefaultRegionId()).toBe(null);
    expect(mockRegionList).not.toHaveBeenCalled();
  });

  it('returns env value when MEDUSA_DEFAULT_REGION_ID is set', async () => {
    process.env.MEDUSA_DEFAULT_REGION_ID = 'reg_from_env';

    expect(await getDefaultRegionId()).toBe('reg_from_env');
    expect(mockRegionList).not.toHaveBeenCalled();
  });

  it('trims whitespace from env value', async () => {
    process.env.MEDUSA_DEFAULT_REGION_ID = '  reg_trimmed  ';

    expect(await getDefaultRegionId()).toBe('reg_trimmed');
    expect(mockRegionList).not.toHaveBeenCalled();
  });

  it('falls back to first region when env is unset', async () => {
    mockRegionList.mockResolvedValue({ regions: [{ id: 'reg_first' }] } as Awaited<
      ReturnType<typeof sdk.store.region.list>
    >);

    expect(await getDefaultRegionId()).toBe('reg_first');
    expect(mockRegionList).toHaveBeenCalledWith({ limit: 1 });
  });

  it('falls back to first region when env is blank', async () => {
    process.env.MEDUSA_DEFAULT_REGION_ID = '   ';
    mockRegionList.mockResolvedValue({ regions: [{ id: 'reg_first' }] } as Awaited<
      ReturnType<typeof sdk.store.region.list>
    >);

    expect(await getDefaultRegionId()).toBe('reg_first');
    expect(mockRegionList).toHaveBeenCalledWith({ limit: 1 });
  });

  it('returns null when fallback API returns no regions', async () => {
    mockRegionList.mockResolvedValue({ regions: [] } as Awaited<
      ReturnType<typeof sdk.store.region.list>
    >);

    expect(await getDefaultRegionId()).toBe(null);
  });
});
