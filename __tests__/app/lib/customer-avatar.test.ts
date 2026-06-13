import {
  buildPublicObjectUrl,
  getCustomerAvatarProxyUrl,
  isAllowedAvatarUrl,
} from '@/app/lib/customer-avatar';

describe('customer-avatar', () => {
  const originalEnv = process.env;
  const publicBase =
    'https://hipsterdonut-user-assets.s3.ca-east-tor.io.cloud.ovh.net';

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.OVH_USER_ASSETS_PUBLIC_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('buildPublicObjectUrl', () => {
    it('builds correct encoded public URL', () => {
      expect(buildPublicObjectUrl('avatars/user123/1700000000000.jpg')).toBe(
        `${publicBase}/avatars/user123/1700000000000.jpg`
      );
    });
  });

  describe('isAllowedAvatarUrl', () => {
    it('accepts bucket URLs under /avatars/', () => {
      expect(
        isAllowedAvatarUrl(`${publicBase}/avatars/user_1/1700000000000.png`)
      ).toBe(true);
    });

    it('rejects external URLs', () => {
      expect(isAllowedAvatarUrl('https://evil.example.com/avatars/x/1.jpg')).toBe(false);
      expect(isAllowedAvatarUrl('http://insecure.example/avatars/x/1.jpg')).toBe(false);
      expect(isAllowedAvatarUrl('not-a-url')).toBe(false);
    });

    it('rejects same-origin paths outside /avatars/', () => {
      expect(isAllowedAvatarUrl(`${publicBase}/brand/logo.png`)).toBe(false);
    });
  });

  describe('getCustomerAvatarProxyUrl', () => {
    it('maps metadata URL to /api/shop/avatar/...', () => {
      const customer = {
        metadata: {
          avatar_url: `${publicBase}/avatars/user_1/1700000000000.webp`,
        },
      };
      expect(getCustomerAvatarProxyUrl(customer)).toBe(
        '/api/shop/avatar/avatars/user_1/1700000000000.webp'
      );
    });

    it('returns null for missing or invalid metadata', () => {
      expect(getCustomerAvatarProxyUrl({})).toBeNull();
      expect(
        getCustomerAvatarProxyUrl({
          metadata: { avatar_url: 'https://evil.example.com/avatars/x/1.jpg' },
        })
      ).toBeNull();
    });
  });
});
