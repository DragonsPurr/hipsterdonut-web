'use client';

import type { ShopActionResult } from '@/app/shop/actions';
import {
  preparePaymentAction,
  selectShippingMethodAction,
  updateCheckoutAddressAction,
} from '@/app/shop/actions';
import type { HttpTypes } from '@medusajs/types';
import { Elements } from '@stripe/react-stripe-js';

export type CheckoutShippingOption = {
  id: string;
  name: string;
  amount?: number | null;
};
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useActionState, useEffect, useMemo, useState, useTransition } from 'react';
import { formatMoney } from '@/app/lib/shop-pricing';
import { CheckoutForm } from './CheckoutForm';

type CheckoutViewProps = {
  cart: HttpTypes.StoreCart;
  shippingOptions: CheckoutShippingOption[];
  stripePublishableKey: string;
  initialClientSecret?: string | null;
};

export function CheckoutView({
  cart,
  shippingOptions,
  stripePublishableKey,
  initialClientSecret = null,
}: CheckoutViewProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(initialClientSecret);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentPending, startPaymentTransition] = useTransition();
  const [shippingPending, startShippingTransition] = useTransition();
  const [selectedShippingOption, setSelectedShippingOption] = useState(
    cart.shipping_methods?.[0]?.shipping_option_id ?? ''
  );

  const [addressState, addressAction, addressPending] = useActionState<
    ShopActionResult | null,
    FormData
  >(updateCheckoutAddressAction, null);

  const stripePromise = useMemo(
    () => loadStripe(stripePublishableKey) as Promise<Stripe | null>,
    [stripePublishableKey]
  );

  useEffect(() => {
    if (initialClientSecret) {
      setClientSecret(initialClientSecret);
    }
  }, [initialClientSecret]);

  const handleShippingChange = (optionId: string) => {
    setSelectedShippingOption(optionId);
    setPaymentError(null);
    startShippingTransition(async () => {
      const result = await selectShippingMethodAction(optionId);
      if (!result.ok) {
        setPaymentError(result.error);
      }
    });
  };

  const handlePreparePayment = () => {
    setPaymentError(null);
    startPaymentTransition(async () => {
      const result = await preparePaymentAction();
      if (!result.ok) {
        setPaymentError(result.error);
        return;
      }
      setClientSecret(result.clientSecret);
    });
  };

  const shippingAddress = cart.shipping_address;
  const cartTotal =
    cart.total != null && cart.currency_code
      ? formatMoney(cart.total, cart.currency_code)
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="space-y-6">
        <div>
          <h2 className="hd-section-header text-2xl mb-4">Shipping</h2>
          <form action={addressAction} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="checkout-email" className="hd-body-text text-sm font-body-bold">
                Email
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                required
                defaultValue={cart.email ?? ''}
                className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="firstName"
                placeholder="First name"
                required
                defaultValue={shippingAddress?.first_name ?? ''}
                className="rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
              />
              <input
                name="lastName"
                placeholder="Last name"
                required
                defaultValue={shippingAddress?.last_name ?? ''}
                className="rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
              />
            </div>
            <input
              name="address1"
              placeholder="Address"
              required
              defaultValue={shippingAddress?.address_1 ?? ''}
              className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City"
                required
                defaultValue={shippingAddress?.city ?? ''}
                className="rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
              />
              <input
                name="postalCode"
                placeholder="Postal code"
                required
                defaultValue={shippingAddress?.postal_code ?? ''}
                className="rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
              />
            </div>
            <input type="hidden" name="countryCode" value={shippingAddress?.country_code ?? 'ca'} />
            <input
              name="phone"
              placeholder="Phone (optional)"
              defaultValue={shippingAddress?.phone ?? ''}
              className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
            />
            {addressState && !addressState.ok && (
              <p role="alert" className="hd-body-text text-sm text-red-800">
                {addressState.error}
              </p>
            )}
            {addressState?.ok && (
              <p className="hd-body-text text-sm text-green-800">Address saved.</p>
            )}
            <button type="submit" disabled={addressPending} className="hd-form-button disabled:opacity-50">
              {addressPending ? 'Saving…' : 'Save address'}
            </button>
          </form>
        </div>

        {shippingOptions.length > 0 && (
          <div>
            <h3 className="font-title text-xl mb-3">Shipping method</h3>
            <div className="space-y-2">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 rounded-md border-2 border-(--hd-dark-blue) bg-white/80 px-3 py-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="shippingOption"
                    value={option.id}
                    checked={selectedShippingOption === option.id}
                    onChange={() => handleShippingChange(option.id)}
                    disabled={shippingPending}
                  />
                  <span className="hd-body-text text-sm">
                    {option.name}
                    {option.amount != null && cart.currency_code
                      ? ` — ${formatMoney(option.amount, cart.currency_code)}`
                      : ''}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="hd-section-header text-2xl">Payment</h2>
        {cartTotal && <p className="hd-body-text text-lg">Total: {cartTotal}</p>}

        {!clientSecret ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handlePreparePayment}
              disabled={paymentPending || !cart.shipping_address}
              className="hd-form-button disabled:opacity-50"
            >
              {paymentPending ? 'Preparing…' : 'Continue to payment'}
            </button>
            {!cart.shipping_address && (
              <p className="hd-body-text text-sm text-(--hd-gray-600)">
                Save your shipping address before continuing.
              </p>
            )}
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm cartId={cart.id} />
          </Elements>
        )}

        {paymentError && (
          <p role="alert" className="hd-body-text text-sm text-red-800">
            {paymentError}
          </p>
        )}
      </section>
    </div>
  );
}
