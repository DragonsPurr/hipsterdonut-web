import { retrieveShopCart } from '@/app/lib/medusa-cart';
import { isMedusaConfigured, sdk } from '@/app/lib/medusa';
import { getStripePublishableKey, isStripeConfigured } from '@/app/lib/stripe';
import { PageTitle } from '@/components/PageTitle';
import { CheckoutView, type CheckoutShippingOption } from '@/components/shop/CheckoutView';
import { ShopErrorAlert } from '@/components/shop/ShopErrorAlert';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order.',
};

export default async function CheckoutPage() {
  if (!isMedusaConfigured()) {
    return (
      <div className="w-full">
        <PageTitle text="Checkout" seed="shop-checkout" />
        <ShopErrorAlert message="Shop is not configured." />
      </div>
    );
  }

  if (!isStripeConfigured()) {
    return (
      <div className="w-full">
        <PageTitle text="Checkout" seed="shop-checkout" />
        <ShopErrorAlert message="Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY." />
        <Link href="/shop/cart" className="hd-body-text underline mt-4 inline-block">
          Back to cart
        </Link>
      </div>
    );
  }

  const cart = await retrieveShopCart();
  if (!cart?.items?.length) {
    redirect('/shop/cart');
  }

  let shippingOptions: CheckoutShippingOption[] = [];

  if (cart.shipping_address) {
    try {
      const response = await sdk.store.fulfillment.listCartOptions({ cart_id: cart.id });
      shippingOptions = (response.shipping_options ?? []).map((option) => ({
        id: option.id,
        name: option.name,
        amount: option.amount,
      }));
    } catch {
      shippingOptions = [];
    }
  }

  const existingSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status !== 'canceled'
  );
  const initialClientSecret =
    typeof existingSession?.data?.client_secret === 'string'
      ? existingSession.data.client_secret
      : null;

  return (
    <div className="w-full">
      <header className="mb-8">
        <PageTitle text="Checkout" seed="shop-checkout" className="mb-4 md:mb-6" />
        <Link href="/shop/cart" className="hd-body-text text-sm underline">
          ← Back to cart
        </Link>
      </header>

      <CheckoutView
        cart={cart}
        shippingOptions={shippingOptions}
        stripePublishableKey={getStripePublishableKey()!}
        initialClientSecret={initialClientSecret}
      />
    </div>
  );
}
