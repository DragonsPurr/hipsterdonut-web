import { retrieveLoggedInCustomer } from '@/app/lib/medusa-auth';
import { PageTitle } from '@/components/PageTitle';
import { ShopAuthForm } from '@/components/shop/ShopAuthForm';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your Hipster Donut shop account.',
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const customer = await retrieveLoggedInCustomer();
  const { next } = await searchParams;
  const nextPath = next?.startsWith('/shop') ? next : '/shop/account';

  if (customer) {
    redirect(nextPath);
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <PageTitle text="Login" seed="shop-login" className="mb-4 md:mb-6" />
        <p className="hd-body-text">Sign in to manage your account and view orders.</p>
      </header>
      <ShopAuthForm mode="login" nextPath={nextPath} />
    </div>
  );
}
