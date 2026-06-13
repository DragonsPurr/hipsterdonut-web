export function getStripePublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripePublishableKey());
}

export const STRIPE_PAYMENT_PROVIDER_ID = 'pp_stripe_stripe';
