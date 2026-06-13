import type { HttpTypes } from '@medusajs/types';
import { formatMedusaError, isMedusaConfigured, sdk } from './medusa';
import { getDefaultRegionId } from './medusa-region';

const MISSING_CONFIG_MESSAGE =
  'Shop is not configured. Set MEDUSA_PUBLISHABLE_KEY or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (and MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_BACKEND_URL) in your environment.';

export type ShopProductsResult =
  | { ok: true; products: HttpTypes.StoreProduct[]; count: number; regionId: string }
  | { ok: false; error: string; code: 'missing_config' | 'api_error' };

export type ShopProductResult =
  | { ok: true; product: HttpTypes.StoreProduct; regionId: string }
  | { ok: false; error: string; code: 'missing_config' | 'not_found' | 'api_error' };

export type ShopCategoryNavItem = {
  id: string;
  name: string;
  handle: string;
};

export type ShopCategoryResult =
  | { ok: true; category: HttpTypes.StoreProductCategory }
  | { ok: false; error: string; code: 'missing_config' | 'not_found' | 'api_error' };

export async function listShopProducts(
  limit = 24,
  categoryId?: string
): Promise<ShopProductsResult> {
  if (!isMedusaConfigured()) {
    return { ok: false, error: MISSING_CONFIG_MESSAGE, code: 'missing_config' };
  }

  const regionId = await getDefaultRegionId();
  if (!regionId) {
    return {
      ok: false,
      error: 'No sales region is configured in Medusa Admin. Add at least one region to show products.',
      code: 'api_error',
    };
  }

  try {
    const { products, count } = await sdk.store.product.list({
      limit,
      region_id: regionId,
      category_id: categoryId,
      fields: '*variants.calculated_price',
    });

    return {
      ok: true,
      products: products ?? [],
      count: count ?? products?.length ?? 0,
      regionId,
    };
  } catch (err) {
    return {
      ok: false,
      error: formatMedusaError(err, 'Could not load products.'),
      code: 'api_error',
    };
  }
}

export async function listShopCategories(): Promise<ShopCategoryNavItem[]> {
  if (!isMedusaConfigured()) return [];

  try {
    const { product_categories: categories } = await sdk.store.category.list({ limit: 100 });
    return (categories ?? [])
      .filter((category) => category.id && category.name && category.handle)
      .map((category) => ({
        id: category.id,
        name: category.name,
        handle: category.handle,
      }));
  } catch (err) {
    console.error('Failed to load shop categories:', formatMedusaError(err, 'Unknown error'));
    return [];
  }
}

export async function retrieveShopProduct(handle: string): Promise<ShopProductResult> {
  if (!isMedusaConfigured()) {
    return { ok: false, error: MISSING_CONFIG_MESSAGE, code: 'missing_config' };
  }

  const regionId = await getDefaultRegionId();
  if (!regionId) {
    return {
      ok: false,
      error: 'No sales region is configured in Medusa Admin.',
      code: 'api_error',
    };
  }

  try {
    const { products } = await sdk.store.product.list({
      handle,
      region_id: regionId,
      limit: 1,
      fields: '*variants.calculated_price',
    });

    const product = products?.[0];
    if (!product) {
      return { ok: false, error: 'Product not found.', code: 'not_found' };
    }

    return { ok: true, product, regionId };
  } catch (err) {
    return {
      ok: false,
      error: formatMedusaError(err, 'Could not load product.'),
      code: 'api_error',
    };
  }
}

export async function retrieveShopCategoryByHandle(handle: string): Promise<ShopCategoryResult> {
  if (!isMedusaConfigured()) {
    return { ok: false, error: MISSING_CONFIG_MESSAGE, code: 'missing_config' };
  }

  try {
    const { product_categories: categories } = await sdk.store.category.list({
      handle,
      limit: 1,
    });

    const category = categories?.[0];
    if (!category) {
      return { ok: false, error: 'Category not found.', code: 'not_found' };
    }

    return { ok: true, category };
  } catch (err) {
    return {
      ok: false,
      error: formatMedusaError(err, 'Could not load category.'),
      code: 'api_error',
    };
  }
}
