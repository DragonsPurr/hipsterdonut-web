'use server';

import {
  applyMedusaAuthFromCookie,
  clearMedusaAuthCookie,
  setMedusaAuthCookie,
} from '@/app/lib/medusa-auth';
import {
  clearCartCookie,
  CART_DETAIL_FIELDS,
  getCartIdFromCookies,
  getOrCreateCart,
  retrieveShopCart,
  setCartCookie,
} from '@/app/lib/medusa-cart';
import { formatMedusaError, isMedusaConfigured, sdk } from '@/app/lib/medusa';
import { STRIPE_PAYMENT_PROVIDER_ID } from '@/app/lib/stripe';
import { AVATAR_MAX_BYTES } from '@/app/lib/customer-avatar';
import { uploadCustomerAvatarToOvh } from '@/app/lib/ovh-user-assets';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ShopActionResult = { ok: true } | { ok: false; error: string };

export type CompleteOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export type PreparePaymentResult =
  | { ok: true; clientSecret: string }
  | { ok: false; error: string };

function revalidateShop() {
  revalidatePath('/', 'layout');
  revalidatePath('/shop', 'layout');
}

function notConfigured(): ShopActionResult {
  return { ok: false, error: 'Shop is not configured.' };
}

export async function addToCartAction(
  variantId: string,
  quantity = 1
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();
  if (!variantId) return { ok: false, error: 'Select a product option.' };

  try {
    const cart = await getOrCreateCart();
    if (!cart?.id) return { ok: false, error: 'Could not create cart.' };

    await sdk.store.cart.createLineItem(
      cart.id,
      { variant_id: variantId, quantity },
      { fields: CART_DETAIL_FIELDS }
    );

    revalidateShop();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not add to cart.') };
  }
}

export async function updateCartLineItemAction(
  lineItemId: string,
  quantity: number
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();

  const cartId = await getCartIdFromCookies();
  if (!cartId) return { ok: false, error: 'Cart not found.' };

  try {
    if (quantity <= 0) {
      await sdk.store.cart.deleteLineItem(cartId, lineItemId, { fields: CART_DETAIL_FIELDS });
    } else {
      await sdk.store.cart.updateLineItem(
        cartId,
        lineItemId,
        { quantity },
        { fields: CART_DETAIL_FIELDS }
      );
    }

    revalidateShop();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not update cart.') };
  }
}

export async function removeCartLineItemAction(lineItemId: string): Promise<ShopActionResult> {
  return updateCartLineItemAction(lineItemId, 0);
}

export async function loginAction(
  _prevState: ShopActionResult | null,
  formData: FormData
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/shop/account').trim() || '/shop/account';

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  try {
    const result = await sdk.auth.login('customer', 'emailpass', { email, password });
    if (typeof result !== 'string') {
      return { ok: false, error: 'Additional authentication steps are required.' };
    }

    await setMedusaAuthCookie(result);

    const cartId = await getCartIdFromCookies();
    if (cartId) {
      await applyMedusaAuthFromCookie();
      await sdk.store.cart.transferCart(cartId, { fields: CART_DETAIL_FIELDS });
    }

    revalidateShop();
    redirect(next);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { ok: false, error: formatMedusaError(err, 'Login failed.') };
  }
}

export async function signupAction(
  _prevState: ShopActionResult | null,
  formData: FormData
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const next = String(formData.get('next') ?? '/shop/account').trim() || '/shop/account';

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  try {
    const registerResult = await sdk.auth.register('customer', 'emailpass', { email, password });
    if (typeof registerResult !== 'string') {
      return { ok: false, error: 'Additional registration steps are required.' };
    }

    await setMedusaAuthCookie(registerResult);

    await sdk.store.customer.create({
      email,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    });

    const cartId = await getCartIdFromCookies();
    if (cartId) {
      await sdk.store.cart.transferCart(cartId, { fields: CART_DETAIL_FIELDS });
    }

    revalidateShop();
    redirect(next);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { ok: false, error: formatMedusaError(err, 'Could not create account.') };
  }
}

export async function logoutAction(): Promise<void> {
  if (isMedusaConfigured() && (await applyMedusaAuthFromCookie())) {
    try {
      await sdk.auth.logout();
    } catch {
      // ignore logout errors
    }
  }

  await clearMedusaAuthCookie();
  revalidateShop();
  redirect('/shop');
}

export async function updateAccountAction(
  _prevState: ShopActionResult | null,
  formData: FormData
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();
  if (!(await applyMedusaAuthFromCookie())) {
    return { ok: false, error: 'You must be logged in.' };
  }

  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();

  try {
    await sdk.store.customer.update({
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    });

    revalidateShop();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not update account.') };
  }
}

export async function uploadAvatarAction(
  _prevState: ShopActionResult | null,
  formData: FormData
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();
  if (!(await applyMedusaAuthFromCookie())) {
    return { ok: false, error: 'You must be logged in.' };
  }

  const file = formData.get('avatar');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Choose an image to upload.' };
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return { ok: false, error: 'Image must be 2 MB or smaller.' };
  }

  try {
    const { customer } = await sdk.store.customer.retrieve();
    if (!customer?.id) return { ok: false, error: 'Customer not found.' };

    const bytes = new Uint8Array(await file.arrayBuffer());
    const avatarUrl = await uploadCustomerAvatarToOvh(customer.id, bytes, file.type);

    await sdk.store.customer.update({
      metadata: {
        ...(customer.metadata ?? {}),
        avatar_url: avatarUrl,
      },
    });

    revalidateShop();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not upload avatar.') };
  }
}

export async function updateCheckoutAddressAction(
  _prevState: ShopActionResult | null,
  formData: FormData
): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();

  const cart = await retrieveShopCart();
  if (!cart?.id) return { ok: false, error: 'Cart not found.' };

  const email = String(formData.get('email') ?? '').trim();
  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const address1 = String(formData.get('address1') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const postalCode = String(formData.get('postalCode') ?? '').trim();
  const countryCode = String(formData.get('countryCode') ?? 'ca').trim().toLowerCase();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!email || !firstName || !lastName || !address1 || !city || !postalCode) {
    return { ok: false, error: 'Fill in all required address fields.' };
  }

  try {
    await sdk.store.cart.update(
      cart.id,
      {
        email,
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address_1: address1,
          city,
          postal_code: postalCode,
          country_code: countryCode,
          phone: phone || undefined,
        },
      },
      { fields: CART_DETAIL_FIELDS }
    );

    revalidateShop();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not update address.') };
  }
}

export async function selectShippingMethodAction(optionId: string): Promise<ShopActionResult> {
  if (!isMedusaConfigured()) return notConfigured();
  if (!optionId) return { ok: false, error: 'Select a shipping method.' };

  const cart = await retrieveShopCart();
  if (!cart?.id) return { ok: false, error: 'Cart not found.' };

  try {
    await sdk.store.cart.addShippingMethod(
      cart.id,
      { option_id: optionId },
      { fields: CART_DETAIL_FIELDS }
    );

    revalidateShop();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not select shipping.') };
  }
}

export async function preparePaymentAction(): Promise<PreparePaymentResult> {
  if (!isMedusaConfigured()) return { ok: false, error: 'Shop is not configured.' };

  const cart = await retrieveShopCart();
  if (!cart?.id) return { ok: false, error: 'Cart not found.' };
  if (!cart.shipping_methods?.length) {
    return { ok: false, error: 'Select a shipping method first.' };
  }

  try {
    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: STRIPE_PAYMENT_PROVIDER_ID,
    });

    const updated = await retrieveShopCart();
    const session = updated?.payment_collection?.payment_sessions?.find(
      (item) => item.status !== 'canceled'
    );
    const clientSecret =
      typeof session?.data?.client_secret === 'string' ? session.data.client_secret : undefined;

    if (!clientSecret) {
      return { ok: false, error: 'Stripe payment is not available. Check Medusa and Stripe setup.' };
    }

    revalidateShop();
    return { ok: true, clientSecret };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not start payment.') };
  }
}

export async function completeOrderAction(cartId: string): Promise<CompleteOrderResult> {
  if (!isMedusaConfigured()) return { ok: false, error: 'Shop is not configured.' };
  if (!cartId) return { ok: false, error: 'Cart not found.' };

  await applyMedusaAuthFromCookie();

  try {
    const result = await sdk.store.cart.complete(cartId);

    if (result.type === 'order' && result.order?.id) {
      await clearCartCookie();
      revalidateShop();
      return { ok: true, orderId: result.order.id };
    }

    const message =
      result.type === 'cart' && result.error?.message
        ? result.error.message
        : 'Could not complete order.';
    return { ok: false, error: message };
  } catch (err) {
    return { ok: false, error: formatMedusaError(err, 'Could not complete order.') };
  }
}
