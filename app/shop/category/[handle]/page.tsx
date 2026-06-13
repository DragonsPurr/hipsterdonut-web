import { listShopProducts, retrieveShopCategoryByHandle } from '@/app/lib/shop';
import { PageTitle } from '@/components/PageTitle';
import { ShopErrorAlert } from '@/components/shop/ShopErrorAlert';
import { ShopProductGrid } from '@/components/shop/ShopProductGrid';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { handle } = await params;
  const result = await retrieveShopCategoryByHandle(handle);

  if (!result.ok) {
    return { title: 'Category' };
  }

  return {
    title: result.category.name,
    description: result.category.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { handle } = await params;
  const categoryResult = await retrieveShopCategoryByHandle(handle);

  if (!categoryResult.ok) {
    if (categoryResult.code === 'not_found') notFound();
    return (
      <div className="w-full">
        <ShopErrorAlert message={categoryResult.error} />
      </div>
    );
  }

  const { category } = categoryResult;
  const productsResult = await listShopProducts(24, category.id);

  return (
    <div className="w-full">
      <Link href="/shop" className="hd-body-text text-sm underline hover:text-(--hd-brand-pink) mb-6 inline-block">
        ← All products
      </Link>
      <header className="mb-8 md:mb-12">
        <PageTitle text={category.name} seed={`shop-category-${handle}`} className="mb-4 md:mb-6" />
        {category.description && <p className="hd-body-text max-w-3xl">{category.description}</p>}
      </header>

      {!productsResult.ok ? (
        <ShopErrorAlert message={productsResult.error} />
      ) : productsResult.products.length === 0 ? (
        <p className="hd-body-text">No products in this category yet.</p>
      ) : (
        <ShopProductGrid products={productsResult.products} count={productsResult.count} />
      )}
    </div>
  );
}
