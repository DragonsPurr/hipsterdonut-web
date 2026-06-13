'use client';

import { updateCartLineItemAction } from '@/app/shop/actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type CartQuantityControlsProps = {
  lineItemId: string;
  quantity: number;
  compact?: boolean;
};

export function CartQuantityControls({
  lineItemId,
  quantity,
  compact = false,
}: CartQuantityControlsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const updateQuantity = (nextQuantity: number) => {
    setError(null);
    startTransition(async () => {
      const result = await updateCartLineItemAction(lineItemId, nextQuantity);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <div className={`inline-flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={pending || quantity <= 1}
          onClick={() => updateQuantity(quantity - 1)}
          className="h-8 w-8 rounded border-2 border-(--hd-dark-blue) hd-body-text disabled:opacity-40"
        >
          −
        </button>
        <span className="min-w-[2rem] text-center hd-body-text">{quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={pending}
          onClick={() => updateQuantity(quantity + 1)}
          className="h-8 w-8 rounded border-2 border-(--hd-dark-blue) hd-body-text disabled:opacity-40"
        >
          +
        </button>
      </div>
      {error && (
        <p role="alert" className="hd-body-text text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
