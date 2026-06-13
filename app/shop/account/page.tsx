import {
  getCustomerDisplayName,
  getLoggedInCustomerAvatarUrl,
  retrieveLoggedInCustomer,
} from '@/app/lib/medusa-auth';
import { isOvhUserAssetsConfigured } from '@/app/lib/ovh-user-assets';
import { PageTitle } from '@/components/PageTitle';
import { AccountForm } from '@/components/shop/AccountForm';
import { AvatarUploadForm } from '@/components/shop/AvatarUploadForm';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your Hipster Donut shop account.',
};

export default async function AccountPage() {
  const customer = await retrieveLoggedInCustomer();
  if (!customer) {
    redirect('/shop/login?next=/shop/account');
  }

  const displayName = getCustomerDisplayName(customer);
  const avatarUrl = getLoggedInCustomerAvatarUrl(customer);

  return (
    <div className="w-full space-y-10">
      <header className="mb-8">
        <PageTitle text="Account" seed="shop-account" className="mb-4 md:mb-6" />
        {displayName && <p className="hd-body-text">Signed in as {displayName}</p>}
      </header>

      <section className="space-y-4">
        <h2 className="hd-section-header text-2xl">Profile</h2>
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt=""
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border-4 border-(--hd-dark-blue) object-cover"
          />
        )}
        <AccountForm customer={customer} />
      </section>

      {isOvhUserAssetsConfigured() && (
        <section className="space-y-4">
          <h2 className="hd-section-header text-2xl">Photo</h2>
          <AvatarUploadForm />
        </section>
      )}

      <section className="space-y-2">
        <Link href="/shop/orders" className="hd-body-text underline">
          View order history
        </Link>
      </section>
    </div>
  );
}
