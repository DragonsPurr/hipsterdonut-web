import { applyMedusaAuthFromCookie } from '@/app/lib/medusa-auth';
import { clearCartCookie } from '@/app/lib/medusa-cart';
import { formatMedusaError, isMedusaConfigured, sdk } from '@/app/lib/medusa';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ cartId: string }> }
) {
  if (!isMedusaConfigured()) {
    return Response.json({ error: 'Shop is not configured.' }, { status: 503 });
  }

  const { cartId } = await params;
  if (!cartId) {
    return Response.json({ error: 'Cart ID is required.' }, { status: 400 });
  }

  await applyMedusaAuthFromCookie();

  try {
    const result = await sdk.store.cart.complete(cartId);

    if (result.type === 'order' && result.order?.id) {
      await clearCartCookie();
      return Response.json({ orderId: result.order.id });
    }

    const message =
      result.type === 'cart' && result.error?.message
        ? result.error.message
        : 'Could not complete order.';
    return Response.json({ error: message }, { status: 422 });
  } catch (err) {
    return Response.json(
      { error: formatMedusaError(err, 'Could not complete order.') },
      { status: 500 }
    );
  }
}
