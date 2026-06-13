import { retrieveShopProduct } from '@/app/lib/shop';
import { getProductDisplayPrice } from '@/app/lib/shop-pricing';
import { PageTitle } from '@/components/PageTitle';
import { ProductPurchase } from '@/components/shop/ProductPurchase';
import { ShopErrorAlert } from '@/components/shop/ShopErrorAlert';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const result = await retrieveShopProduct(handle);

  if (!result.ok) {
    return { title: 'Product' };
  }

  return {
    title: result.product.title,
    description: result.product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const result = await retrieveShopProduct(handle);

  if (!result.ok) {
    if (result.code === 'not_found') notFound();
    return (
      <div className="w-full">
        <ShopErrorAlert message={result.error} />
      </div>
    );
  }

  const { product } = result;
  const price = getProductDisplayPrice(product);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-square rounded-lg border-2 border-(--hd-dark-blue) bg-white/80 overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center hd-body-text text-(--hd-gray-600)">
              No image
            </div>
          )}
        </div>
        <div className="space-y-4">
          <PageTitle text={product.title} seed={`shop-product-${handle}`} className="mb-4 md:mb-6" />
          {price && <p className="font-body-bold text-2xl">{price}</p>}
          {product.description && (
            <p className="font-body-bold whitespace-pre-wrap">{product.description}</p>
          )}
          <ProductPurchase product={product} />
        </div>
      </div>
    </div>
  );
}
