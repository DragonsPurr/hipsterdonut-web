'use client';

import type { ShopActionResult } from '@/app/shop/actions';
import { uploadAvatarAction } from '@/app/shop/actions';
import { useActionState } from 'react';

export function AvatarUploadForm() {
  const [state, formAction, pending] = useActionState<ShopActionResult | null, FormData>(
    uploadAvatarAction,
    null
  );

  return (
    <form action={formAction} className="max-w-md space-y-3">
      <div className="space-y-1">
        <label htmlFor="avatar" className="hd-body-text text-sm font-body-bold">
          Profile photo
        </label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block w-full hd-body-text text-sm"
        />
        <p className="hd-body-text text-xs text-(--hd-gray-600)">JPEG, PNG, WebP, or GIF up to 2 MB.</p>
      </div>

      {state && !state.ok && (
        <p role="alert" className="hd-body-text text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="hd-body-text text-sm text-green-800">Photo updated.</p>}

      <button type="submit" disabled={pending} className="hd-form-button disabled:opacity-50">
        {pending ? 'Uploading…' : 'Upload photo'}
      </button>
    </form>
  );
}
