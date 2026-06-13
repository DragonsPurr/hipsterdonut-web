import { siteInfo } from './constants';

export function buildPhoneHref(phone: string = siteInfo.phone): string {
  return `tel:${phone.replace(/\D/g, '')}`;
}

export function buildMailtoHref(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export const contactLinks = {
  phone: buildPhoneHref(),
  productSupport: buildMailtoHref(siteInfo.productSupportEmail, 'Product support request'),
  generalInquiry: buildMailtoHref(siteInfo.generalInquiryEmail, 'General inquiry'),
  billingInquiry: buildMailtoHref(siteInfo.billingInquiryEmail, 'Billing inquiry'),
} as const;
