'use client';

import { addToCartAction } from '@/app/shop/actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type AddToCartButtonProps = {
  variantId: string;
  disabled?: boolean;
};

export function AddToCartButton({ variantId, disabled = false }: AddToCartButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await addToCartAction(variantId, 1);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending || !variantId}
        className="hd-form-button w-full sm:w-auto disabled:opacity-50"
      >
        {pending ? 'Adding…' : 'Add to cart'}
      </button>
      {error && (
        <p role="alert" className="hd-body-text text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
