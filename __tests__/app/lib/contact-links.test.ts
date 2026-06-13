import { siteInfo } from '@/app/lib/constants';
import { buildMailtoHref, buildPhoneHref, contactLinks } from '@/app/lib/contact-links';

describe('contact-links', () => {
  it('buildPhoneHref strips non-digits for tel:', () => {
    expect(buildPhoneHref('+1 (416) 555-1234')).toBe('tel:14165551234');
  });

  it('buildMailtoHref encodes the subject', () => {
    expect(buildMailtoHref('info@example.com', 'General inquiry')).toBe(
      'mailto:info@example.com?subject=General%20inquiry',
    );
  });

  it('contactLinks uses siteInfo contact fields', () => {
    expect(contactLinks.phone).toBe(buildPhoneHref(siteInfo.phone));
    expect(contactLinks.productSupport).toContain(siteInfo.productSupportEmail);
    expect(contactLinks.productSupport).toContain('subject=Product%20support%20request');
    expect(contactLinks.generalInquiry).toContain('subject=General%20inquiry');
    expect(contactLinks.billingInquiry).toContain('subject=Billing%20inquiry');
  });
});
