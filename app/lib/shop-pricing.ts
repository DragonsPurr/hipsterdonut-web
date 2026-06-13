import type { HttpTypes } from '@medusajs/types';

const SHOP_PRICE_LOCALE = 'en-CA';

type CalculatedPrice = HttpTypes.StoreProductVariant['calculated_price'];

export function formatMoney(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(SHOP_PRICE_LOCALE, {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount);
}

export function formatVariantPrice(calculatedPrice: CalculatedPrice | undefined | null): string | null {
  const amount = calculatedPrice?.calculated_amount;
  const currency = calculatedPrice?.currency_code;
  if (amount == null || !currency) return null;

  return formatMoney(amount, currency);
}

export function getProductDisplayPrice(product: HttpTypes.StoreProduct): string | null {
  const prices = (product.variants ?? [])
    .map((variant) => formatVariantPrice(variant.calculated_price))
    .filter((price): price is string => Boolean(price));

  return prices[0] ?? null;
}
