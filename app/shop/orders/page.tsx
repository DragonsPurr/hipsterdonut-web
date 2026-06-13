import { applyMedusaAuthFromCookie, retrieveLoggedInCustomer } from '@/app/lib/medusa-auth';
import { formatMoney } from '@/app/lib/shop-pricing';
import { isMedusaConfigured, sdk } from '@/app/lib/medusa';
import { PageTitle } from '@/components/PageTitle';
import { ShopErrorAlert } from '@/components/shop/ShopErrorAlert';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Your Hipster Donut order history.',
};

type OrdersPageProps = {
  searchParams: Promise<{ placed?: string }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  if (!isMedusaConfigured()) {
    return (
      <div className="w-full">
        <PageTitle text="Orders" seed="shop-orders" />
        <ShopErrorAlert message="Shop is not configured." />
      </div>
    );
  }

  const customer = await retrieveLoggedInCustomer();
  if (!customer) {
    redirect('/shop/login?next=/shop/orders');
  }

  await applyMedusaAuthFromCookie();

  let orders: Awaited<ReturnType<typeof sdk.store.order.list>>['orders'] = [];
  try {
    const response = await sdk.store.order.list({ limit: 20, order: '-created_at' });
    orders = response.orders ?? [];
  } catch {
    return (
      <div className="w-full">
        <PageTitle text="Orders" seed="shop-orders" />
        <ShopErrorAlert message="Could not load orders." />
      </div>
    );
  }

  const { placed } = await searchParams;

  return (
    <div className="w-full">
      <header className="mb-8">
        <PageTitle text="Orders" seed="shop-orders" className="mb-4 md:mb-6" />
        {placed && (
          <p className="hd-body-text text-green-800" role="status">
            Thank you! Your order was placed successfully.
          </p>
        )}
      </header>

      {orders.length === 0 ? (
        <div className="space-y-4">
          <p className="hd-body-text">You have not placed any orders yet.</p>
          <Link href="/shop" className="hd-form-button inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="space-y-4 list-none m-0 p-0">
          {orders.map((order) => {
            const total =
              order.total != null && order.currency_code
                ? formatMoney(order.total, order.currency_code)
                : null;
            const createdAt = order.created_at
              ? new Date(order.created_at).toLocaleDateString('en-CA')
              : null;

            return (
              <li key={order.id} className="hd-contact-card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-title text-lg">Order #{order.display_id ?? order.id.slice(-8)}</p>
                  {createdAt && <p className="hd-body-text text-sm text-(--hd-gray-600)">{createdAt}</p>}
                </div>
                {total && <p className="hd-body-text mt-2">{total}</p>}
                <p className="hd-body-text text-sm text-(--hd-gray-600) mt-1 capitalize">
                  {order.status ?? 'pending'}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
