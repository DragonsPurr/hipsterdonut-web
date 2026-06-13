'use client';

import { completeOrderAction } from '@/app/shop/actions';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type CheckoutFormProps = {
  cartId: string;
};

export function CheckoutForm({ cartId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Payment validation failed.');
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed.');
      return;
    }

    startTransition(async () => {
      const result = await completeOrderAction(cartId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/shop/orders?placed=${encodeURIComponent(result.orderId)}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p role="alert" className="hd-body-text text-sm text-red-800">
          {error}
        </p>
      )}
      <button type="submit" disabled={!stripe || pending} className="hd-form-button disabled:opacity-50">
        {pending ? 'Placing order…' : 'Place order'}
      </button>
    </form>
  );
}
