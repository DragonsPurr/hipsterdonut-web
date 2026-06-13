import { retrieveLoggedInCustomer } from '@/app/lib/medusa-auth';
import { PageTitle } from '@/components/PageTitle';
import { ShopAuthForm } from '@/components/shop/ShopAuthForm';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create a Hipster Donut shop account.',
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const customer = await retrieveLoggedInCustomer();
  const { next } = await searchParams;
  const nextPath = next?.startsWith('/shop') ? next : '/shop/account';

  if (customer) {
    redirect(nextPath);
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <PageTitle text="Create account" seed="shop-signup" className="mb-4 md:mb-6" />
        <p className="hd-body-text">Create an account to track orders and save your details.</p>
      </header>
      <ShopAuthForm mode="signup" nextPath={nextPath} />
    </div>
  );
}
