import { retrieveShopCart } from '@/app/lib/medusa-cart';
import { formatMoney } from '@/app/lib/shop-pricing';
import { isMedusaConfigured } from '@/app/lib/medusa';
import { PageTitle } from '@/components/PageTitle';
import { CartLineItem } from '@/components/shop/CartLineItem';
import { ShopErrorAlert } from '@/components/shop/ShopErrorAlert';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review items in your cart.',
};

export default async function CartPage() {
  if (!isMedusaConfigured()) {
    return (
      <div className="w-full">
        <PageTitle text="Cart" seed="shop-cart" />
        <ShopErrorAlert message="Shop is not configured." />
      </div>
    );
  }

  const cart = await retrieveShopCart();
  const items = cart?.items ?? [];
  const total =
    cart?.total != null && cart.currency_code
      ? formatMoney(cart.total, cart.currency_code)
      : null;

  return (
    <div className="w-full">
      <PageTitle text="Cart" seed="shop-cart" />

      {items.length === 0 ? (
        <div className="space-y-4">
          <p className="hd-body-text">Your cart is empty.</p>
          <Link href="/shop" className="hd-form-button inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8">
          <ul className="list-none m-0 p-0">
            {items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                productHandle={item.product_handle ?? null}
              />
            ))}
          </ul>
          <aside className="hd-contact-card h-fit space-y-4">
            {total && (
              <p className="hd-body-text text-xl font-body-bold">Total: {total}</p>
            )}
            <Link href="/shop/checkout" className="hd-form-button inline-block w-full text-center">
              Checkout
            </Link>
            <Link href="/shop" className="hd-body-text text-sm underline block text-center">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
