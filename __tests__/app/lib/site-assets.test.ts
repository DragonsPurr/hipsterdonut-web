import {
  buildSiteAssetUrl,
  getSiteAssetsPublicBaseUrl,
  isAllowedSiteAssetObjectKey,
} from '@/app/lib/site-assets';

describe('site-assets', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.OVH_SITE_ASSETS_PUBLIC_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('buildSiteAssetUrl', () => {
    it('returns same-origin proxy paths', () => {
      expect(buildSiteAssetUrl('brand/hipsterdonut_square-orig-colour.png')).toBe(
        '/api/assets/brand/hipsterdonut_square-orig-colour.png'
      );
      expect(buildSiteAssetUrl('eeby-deeby-404.jpg')).toBe('/api/assets/eeby-deeby-404.jpg');
      expect(buildSiteAssetUrl('brand/donut-bg.png')).toBe('/api/assets/brand/donut-bg.png');
    });
  });

  describe('getSiteAssetsPublicBaseUrl', () => {
    it('uses env override when set', () => {
      process.env.OVH_SITE_ASSETS_PUBLIC_URL = 'https://custom.example.com/';
      expect(getSiteAssetsPublicBaseUrl()).toBe('https://custom.example.com');
    });

    it('strips trailing slash from default', () => {
      expect(getSiteAssetsPublicBaseUrl()).toBe(
        'https://dp-hd-assets.s3.ca-east-tor.io.cloud.ovh.net'
      );
    });
  });

  describe('isAllowedSiteAssetObjectKey', () => {
    it('allows valid brand and root-level keys', () => {
      expect(isAllowedSiteAssetObjectKey('brand/donut-bg.png')).toBe(true);
      expect(isAllowedSiteAssetObjectKey('brand/hipsterdonut_wide-orig-colour.png')).toBe(true);
      expect(isAllowedSiteAssetObjectKey('eeby-deeby-404.jpg')).toBe(true);
      expect(isAllowedSiteAssetObjectKey('kayt-and-ryan.png')).toBe(true);
      expect(isAllowedSiteAssetObjectKey('brand/bad name.png')).toBe(false);
    });

    it('rejects traversal and wrong prefixes', () => {
      expect(isAllowedSiteAssetObjectKey('')).toBe(false);
      expect(isAllowedSiteAssetObjectKey('../secret')).toBe(false);
      expect(isAllowedSiteAssetObjectKey('/brand/logo.png')).toBe(false);
      expect(isAllowedSiteAssetObjectKey('uploads/photo.jpg')).toBe(false);
      expect(isAllowedSiteAssetObjectKey('brand/../etc/passwd')).toBe(false);
    });
  });
});
