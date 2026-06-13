'use client';

import type { ShopActionResult } from '@/app/shop/actions';
import { updateAccountAction } from '@/app/shop/actions';
import type { LoggedInCustomer } from '@/app/lib/medusa-auth';
import { useActionState } from 'react';

type AccountFormProps = {
  customer: LoggedInCustomer;
};

export function AccountForm({ customer }: AccountFormProps) {
  const [state, formAction, pending] = useActionState<ShopActionResult | null, FormData>(
    updateAccountAction,
    null
  );

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-1">
        <label htmlFor="account-email" className="hd-body-text text-sm font-body-bold">
          Email
        </label>
        <input
          id="account-email"
          type="email"
          value={customer.email}
          readOnly
          className="w-full rounded-md border-2 border-(--hd-dark-blue)/50 bg-gray-100 px-3 py-2 hd-body-text"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="account-firstName" className="hd-body-text text-sm font-body-bold">
            First name
          </label>
          <input
            id="account-firstName"
            name="firstName"
            type="text"
            defaultValue={customer.firstName ?? ''}
            className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="account-lastName" className="hd-body-text text-sm font-body-bold">
            Last name
          </label>
          <input
            id="account-lastName"
            name="lastName"
            type="text"
            defaultValue={customer.lastName ?? ''}
            className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
          />
        </div>
      </div>

      {state && !state.ok && (
        <p role="alert" className="hd-body-text text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="hd-body-text text-sm text-green-800">Account updated.</p>}

      <button type="submit" disabled={pending} className="hd-form-button disabled:opacity-50">
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
