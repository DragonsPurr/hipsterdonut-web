import type { HttpTypes } from '@medusajs/types';
import { cookies } from 'next/headers';
import { getDefaultRegionId } from './medusa-region';
import { formatMedusaError, isMedusaConfigured, sdk } from './medusa';
import { formatVariantPrice } from './shop-pricing';

export const MEDUSA_CART_COOKIE = '_medusa_cart_id';

const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

export const CART_DETAIL_FIELDS =
  '*items,*items.variant,*items.variant.calculated_price,*items.thumbnail,*shipping_address,*shipping_methods,*payment_collection,*payment_collection.payment_sessions';

export type ShopCartNavItem = {
  id: string;
  title: string;
  variantTitle: string | null;
  thumbnail: string | null;
  quantity: number;
  unitPrice: string | null;
};

export type ShopCartNavPreview = {
  itemCount: number;
  items: ShopCartNavItem[];
  total: number | null;
  currencyCode: string | null;
};

const EMPTY_CART: ShopCartNavPreview = {
  itemCount: 0,
  items: [],
  total: null,
  currencyCode: null,
};

export async function getCartIdFromCookies(): Promise<string | undefined> {
  return (await cookies()).get(MEDUSA_CART_COOKIE)?.value;
}

export async function setCartCookie(cartId: string): Promise<void> {
  (await cookies()).set(MEDUSA_CART_COOKIE, cartId, CART_COOKIE_OPTIONS);
}

export async function clearCartCookie(): Promise<void> {
  (await cookies()).delete(MEDUSA_CART_COOKIE);
}

function mapCartToPreview(cart: HttpTypes.StoreCart): ShopCartNavPreview {
  const items: ShopCartNavItem[] = (cart.items ?? []).map((item) => ({
    id: item.id,
    title: item.title ?? item.product_title ?? 'Item',
    variantTitle: item.variant_title ?? null,
    thumbnail: item.thumbnail ?? null,
    quantity: item.quantity,
    unitPrice: formatVariantPrice(item.variant?.calculated_price),
  }));

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    itemCount,
    items,
    total: cart.total ?? null,
    currencyCode: cart.currency_code ?? null,
  };
}

export async function retrieveShopCart(): Promise<HttpTypes.StoreCart | null> {
  if (!isMedusaConfigured()) return null;

  const cartId = await getCartIdFromCookies();
  if (!cartId) return null;

  try {
    const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_DETAIL_FIELDS });
    return cart ?? null;
  } catch (err) {
    console.error('Failed to retrieve cart:', formatMedusaError(err, 'Unknown error'));
    await clearCartCookie();
    return null;
  }
}

export async function getOrCreateCart(): Promise<HttpTypes.StoreCart | null> {
  if (!isMedusaConfigured()) return null;

  const existing = await retrieveShopCart();
  if (existing) return existing;

  const regionId = await getDefaultRegionId();
  if (!regionId) return null;

  try {
    const { cart } = await sdk.store.cart.create({ region_id: regionId }, { fields: CART_DETAIL_FIELDS });
    if (cart?.id) {
      await setCartCookie(cart.id);
    }
    return cart ?? null;
  } catch (err) {
    console.error('Failed to create cart:', formatMedusaError(err, 'Unknown error'));
    return null;
  }
}

export async function getShopCartNavPreview(): Promise<ShopCartNavPreview> {
  const cart = await retrieveShopCart();
  if (!cart?.items?.length) return EMPTY_CART;
  return mapCartToPreview(cart);
}
