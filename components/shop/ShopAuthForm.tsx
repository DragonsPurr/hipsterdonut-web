'use client';

import type { ShopActionResult } from '@/app/shop/actions';
import { loginAction, signupAction } from '@/app/shop/actions';
import Link from 'next/link';
import { useActionState } from 'react';

type ShopAuthFormProps = {
  mode: 'login' | 'signup';
  nextPath?: string;
};

export function ShopAuthForm({ mode, nextPath = '/shop/account' }: ShopAuthFormProps) {
  const action = mode === 'login' ? loginAction : signupAction;
  const [state, formAction, pending] = useActionState<ShopActionResult | null, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      {mode === 'signup' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="hd-body-text text-sm font-body-bold">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="lastName" className="hd-body-text text-sm font-body-bold">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="hd-body-text text-sm font-body-bold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="hd-body-text text-sm font-body-bold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className="w-full rounded-md border-2 border-(--hd-dark-blue) bg-white px-3 py-2 hd-body-text"
        />
      </div>

      {state && !state.ok && (
        <p role="alert" className="hd-body-text text-sm text-red-800">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="hd-form-button disabled:opacity-50">
        {pending ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>

      <p className="hd-body-text text-sm">
        {mode === 'login' ? (
          <>
            Need an account?{' '}
            <Link href={`/shop/signup?next=${encodeURIComponent(nextPath)}`} className="underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href={`/shop/login?next=${encodeURIComponent(nextPath)}`} className="underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
