import { getProductDisplayPrice } from '@/app/lib/shop-pricing';
import type { HttpTypes } from '@medusajs/types';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  product: HttpTypes.StoreProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = getProductDisplayPrice(product);
  const href = `/shop/${product.handle}`;

  return (
    <article className="min-w-0 flex flex-col">
      <Link
        href={href}
        className="block aspect-square rounded-lg bg-white/80 border-2 border-(--hd-dark-blue) overflow-hidden transition-transform hover:scale-[1.02]"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center hd-body-text text-(--hd-gray-600)">
            No image
          </div>
        )}
      </Link>
      <div className="mt-3 space-y-1">
        <h2 className="font-title text-lg md:text-xl">
          <Link href={href} className="text-black hover:text-(--hd-brand-pink) transition-colors">
            {product.title}
          </Link>
        </h2>
        {price && <p className="font-body-bold text-lg">{price}</p>}
        {product.description && (
          <p className="font-body-bold text-sm text-(--hd-gray-600) line-clamp-2">{product.description}</p>
        )}
      </div>
    </article>
  );
}
